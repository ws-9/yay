package com.ws.yay_backend.service;

import com.ws.yay_backend.components.AuthUtilsComponent;
import com.ws.yay_backend.dao.BannedUserRepository;
import com.ws.yay_backend.dao.CommunityMemberRepository;
import com.ws.yay_backend.dao.CommunityRepository;
import com.ws.yay_backend.dao.UserRepository;
import com.ws.yay_backend.dto.request.CreateBanRequest;
import com.ws.yay_backend.dto.response.BannedUserResponse;
import com.ws.yay_backend.entity.BannedUser;
import com.ws.yay_backend.entity.Community;
import com.ws.yay_backend.entity.CommunityMember;
import com.ws.yay_backend.entity.User;
import com.ws.yay_backend.entity.embedded.BannedUserKey;
import com.ws.yay_backend.entity.embedded.CommunityMemberKey;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.Arrays;
import java.util.List;

@Service
public class BanServiceImpl implements BanService {
  private final BannedUserRepository bannedUserRepository;
  private final CommunityRepository communityRepository;
  private final CommunityMemberRepository communityMemberRepository;
  private final UserRepository userRepository;
  private final AuthUtilsComponent authUtilsComponent;

  @Autowired
  public BanServiceImpl(
      BannedUserRepository bannedUserRepository,
      CommunityRepository communityRepository,
      CommunityMemberRepository communityMemberRepository,
      UserRepository userRepository,
      AuthUtilsComponent authUtilsComponent
  ) {
    this.bannedUserRepository = bannedUserRepository;
    this.communityRepository = communityRepository;
    this.communityMemberRepository = communityMemberRepository;
    this.userRepository = userRepository;
    this.authUtilsComponent = authUtilsComponent;
  }

  @Override
  @Transactional(readOnly = true)
  public List<BannedUserResponse> getBannedUsers(Long communityId) {
    Long userId = authUtilsComponent.getAuthenticatedUserId();
    boolean isAdmin = authUtilsComponent.isCurrentUserAdmin();

    boolean communityExists = communityRepository.existsById(communityId);
    if (!communityExists) {
      throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Community not found");
    }

    if (!isAdmin) {
      // Check if user is a member of the community
      CommunityMember membership = communityMemberRepository
          .findWithRoleByKey(new CommunityMemberKey(communityId, userId))
          .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Community not found"));

      if (!membership.getRole().getCanBanUsers()) {
        throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You don't have permission to view banned users");
      }
    }

    // Get all banned users for the community
    List<BannedUser> bannedUsers = bannedUserRepository.findAllWithUserAndCommunityByKey_CommunityId(communityId);

    return bannedUsers.stream()
        .map(bannedUser -> new BannedUserResponse(
            bannedUser.getUser().getId(),
            bannedUser.getUser().getUsername(),
            bannedUser.getCommunity().getId(),
            bannedUser.getCommunity().getName()
        ))
        .toList();
  }

  @Override
  @Transactional
  public BannedUserResponse banUser(CreateBanRequest request) {
    Long userId = authUtilsComponent.getAuthenticatedUserId();

    Community community = communityRepository.findWithOwnerById(request.communityId())
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Community not found"));

    User targetUser = userRepository.findById(request.userId())
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

    BannedUserKey banKey = new BannedUserKey(request.communityId(), request.userId());
    if (bannedUserRepository.existsById(banKey)) {
      throw new ResponseStatusException(HttpStatus.CONFLICT, "User is already banned from this community");
    }

    // Cannot ban the community owner
    boolean isTargetOwner = community.getOwner().getId().equals(request.userId());
    if (isTargetOwner) {
      throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Cannot ban the community owner");
    }

    boolean isAdmin = authUtilsComponent.isCurrentUserAdmin();
    if (isAdmin) {
      // If user is currently a member, remove them first
      CommunityMemberKey memberKey = new CommunityMemberKey(request.communityId(), request.userId());
      communityMemberRepository.deleteById(memberKey);

      // Create the ban
      BannedUser bannedUser = new BannedUser(community, targetUser);
      bannedUserRepository.save(bannedUser);

      return new BannedUserResponse(
          targetUser.getId(),
          targetUser.getUsername(),
          community.getId(),
          community.getName()
      );
    }

    // Regular user logic - check permissions
    boolean isOwner = community.getOwner().getId().equals(userId);

    if (!isOwner) {
      // Fetch both memberships in one query
      List<CommunityMember> memberships = communityMemberRepository
          .findAllWithRoleByKey_CommunityIdAndKey_UserIdIn(request.communityId(), Arrays.asList(userId, request.userId()));

      CommunityMember membership = memberships.stream()
          .filter(m -> m.getKey().getUserId().equals(userId))
          .findFirst()
          .orElseThrow(() -> new ResponseStatusException(HttpStatus.FORBIDDEN, "You are not a member of this community"));

      if (!membership.getRole().getCanBanUsers()) {
        throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You don't have permission to ban users");
      }

      CommunityMember targetMembership = memberships.stream()
          .filter(m -> m.getKey().getUserId().equals(request.userId()))
          .findFirst()
          .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

      boolean hasSufficientHierarchy = targetMembership.getRole().getHierarchyLevel() > membership.getRole().getHierarchyLevel();
      if (!hasSufficientHierarchy) {
        throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You don't have permission to ban users of higher hierarchy");
      }
    }

    // If user is currently a member, remove them first
    CommunityMemberKey memberKey = new CommunityMemberKey(request.communityId(), request.userId());
    communityMemberRepository.deleteById(memberKey);

    // Create the ban
    BannedUser bannedUser = new BannedUser(community, targetUser);
    bannedUserRepository.save(bannedUser);

    return new BannedUserResponse(
        targetUser.getId(),
        targetUser.getUsername(),
        community.getId(),
        community.getName()
    );
  }
}