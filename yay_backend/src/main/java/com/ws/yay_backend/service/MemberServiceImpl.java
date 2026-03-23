package com.ws.yay_backend.service;

import com.ws.yay_backend.components.AuthUtilsComponent;
import com.ws.yay_backend.dao.BannedUserRepository;
import com.ws.yay_backend.dao.CommunityMemberRepository;
import com.ws.yay_backend.dao.CommunityRepository;
import com.ws.yay_backend.dao.CommunityRoleRepository;
import com.ws.yay_backend.dto.request.JoinCommunityRequest;
import com.ws.yay_backend.dto.request.UpdateMemberRoleRequest;
import com.ws.yay_backend.dto.request.UpdateRoleRequest;
import com.ws.yay_backend.dto.response.MemberResponse;
import com.ws.yay_backend.entity.Community;
import com.ws.yay_backend.entity.CommunityMember;
import com.ws.yay_backend.entity.CommunityRole;
import com.ws.yay_backend.entity.CommunityRoleName;
import com.ws.yay_backend.entity.User;
import com.ws.yay_backend.entity.embedded.BannedUserKey;
import com.ws.yay_backend.entity.embedded.CommunityMemberKey;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
public class MemberServiceImpl implements MemberService {
  private final CommunityRepository communityRepository;
  private final CommunityMemberRepository communityMemberRepository;
  private final CommunityRoleRepository communityRoleRepository;
  private final BannedUserRepository bannedUserRepository;
  private final AuthUtilsComponent authUtilsComponent;

  public MemberServiceImpl(
      CommunityRepository communityRepository,
      CommunityMemberRepository communityMemberRepository,
      CommunityRoleRepository communityRoleRepository,
      BannedUserRepository bannedUserRepository,
      AuthUtilsComponent authUtilsComponent) {
    this.communityRepository = communityRepository;
    this.communityMemberRepository = communityMemberRepository;
    this.communityRoleRepository = communityRoleRepository;
    this.bannedUserRepository = bannedUserRepository;
    this.authUtilsComponent = authUtilsComponent;
  }

  @Override
  @Transactional
  public MemberResponse updateRole(UpdateRoleRequest request) {
    Long userId = authUtilsComponent.getAuthenticatedUserId();

    CommunityMember membership =
        communityMemberRepository
            .findWithUserAndRoleAndCommunityAndOwnerByKey(
                new CommunityMemberKey(request.communityId(), userId))
            .orElseThrow(
                () ->
                    new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Community not found with id: " + request.communityId()));

    Community community = membership.getCommunity();

    CommunityRole newRole =
        communityRoleRepository
            .findByName(request.role())
            .orElseThrow(
                () ->
                    new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Role not found with name: " + request.role()));

    boolean isOwner = userId.equals(community.getOwner().getId());
    boolean isTargetOwner = community.getOwner().getId().equals(request.userId());
    boolean isTargetSelf = userId.equals(request.userId());

    if (isTargetOwner) {
      throw new ResponseStatusException(
          HttpStatus.FORBIDDEN, "Cannot change role of community owner");
    }

    // Owner should be able to change anyone's role without question.
    if (isOwner) {
      CommunityMember targetMembership =
          communityMemberRepository
              .findWithUserByKey(new CommunityMemberKey(request.communityId(), request.userId()))
              .orElseThrow(
                  () ->
                      new ResponseStatusException(
                          HttpStatus.NOT_FOUND, "User not found with id: " + request.userId()));

      targetMembership.setRole(newRole);

      return MemberResponse.fromEntity(targetMembership);
    }

    // You should always be able to demote yourself
    if (isTargetSelf) {
      if (newRole.getHierarchyLevel() <= membership.getRole().getHierarchyLevel()) {
        throw new ResponseStatusException(
            HttpStatus.FORBIDDEN,
            "You can only demote yourself, not promote or stay at the same role");
      }

      membership.setRole(newRole);

      return MemberResponse.fromEntity(membership);
    }

    // Otherwise, compare hierarchy levels

    CommunityMember targetMembership =
        communityMemberRepository
            .findWithUserByKey(new CommunityMemberKey(request.communityId(), request.userId()))
            .orElseThrow(
                () ->
                    new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "User not found with id: " + request.userId()));

    boolean canManageRoles = membership.getRole().getCanManageRoles();
    if (!canManageRoles) {
      throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You cannot change roles");
    }

    // Can only change roles of users with lower authority (higher hierarchy level)
    boolean targetHasLowerAuthority =
        targetMembership.getRole().getHierarchyLevel() > membership.getRole().getHierarchyLevel();
    if (!targetHasLowerAuthority) {
      throw new ResponseStatusException(
          HttpStatus.FORBIDDEN, "Cannot change role of user with equal or higher authority");
    }

    // Can only assign roles weaker than their own (higher hierarchy level)
    boolean newRoleIsWeaker =
        newRole.getHierarchyLevel() > membership.getRole().getHierarchyLevel();
    if (!newRoleIsWeaker) {
      throw new ResponseStatusException(
          HttpStatus.FORBIDDEN, "Cannot assign role equal to or stronger than your own");
    }

    targetMembership.setRole(newRole);

    return MemberResponse.fromEntity(targetMembership);
  }

  @Override
  @Transactional
  public MemberResponse joinCommunity(JoinCommunityRequest request) {
    User user = authUtilsComponent.getAuthenticatedUser();

    Community community =
        communityRepository
            .findByInviteSlug(request.inviteSlug())
            .orElseThrow(
                () -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Invalid invite slug"));

    BannedUserKey bannedKey = new BannedUserKey(community.getId(), user.getId());
    if (bannedUserRepository.existsById(bannedKey)) {
      throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You are banned from this community");
    }

    CommunityMemberKey key = new CommunityMemberKey(community.getId(), user.getId());
    CommunityMember communityMember =
        communityMemberRepository
            .findById(key)
            .orElseGet(
                () -> {
                  CommunityRole memberRole =
                      communityRoleRepository
                          .findByName(CommunityRoleName.MEMBER.getValue())
                          .orElseThrow(
                              () ->
                                  new ResponseStatusException(
                                      HttpStatus.INTERNAL_SERVER_ERROR,
                                      "Default member role not found"));
                  return communityMemberRepository.save(
                      new CommunityMember(community, user, memberRole));
                });

    return MemberResponse.fromEntity(communityMember);
  }

  @Override
  @Transactional
  public MemberResponse updateMemberRole(
      long communityId, long userId, UpdateMemberRoleRequest request) {
    Long currentUserId = authUtilsComponent.getAuthenticatedUserId();

    CommunityMember currentUserMembership =
        communityMemberRepository
            .findWithRoleAndCommunityAndOwnerByKey(
                new CommunityMemberKey(communityId, currentUserId))
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.FORBIDDEN, "Access denied"));

    CommunityRole newRole =
        communityRoleRepository
            .findById(request.roleId())
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Role not found"));

    Community community = currentUserMembership.getCommunity();
    boolean isOwner = currentUserId.equals(community.getOwner().getId());
    boolean isTargetOwner = community.getOwner().getId().equals(userId);
    boolean isTargetSelf = currentUserId.equals(userId);

    if (isTargetOwner) {
      throw new ResponseStatusException(
          HttpStatus.FORBIDDEN, "Cannot change role of community owner");
    }

    CommunityMember targetMembership =
        communityMemberRepository
            .findWithRoleByKey(new CommunityMemberKey(communityId, userId))
            .orElseThrow(
                () -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Member not found"));

    if (isOwner) {
      targetMembership.setRole(newRole);
    } else if (isTargetSelf) {
      if (newRole.getHierarchyLevel() <= currentUserMembership.getRole().getHierarchyLevel()) {
        throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You can only demote yourself");
      }
      targetMembership.setRole(newRole);
    } else {
      if (!currentUserMembership.getRole().getCanManageRoles()) {
        throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Permission denied");
      }
      if (targetMembership.getRole().getHierarchyLevel()
          <= currentUserMembership.getRole().getHierarchyLevel()) {
        throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Insufficient authority");
      }
      if (newRole.getHierarchyLevel() <= currentUserMembership.getRole().getHierarchyLevel()) {
        throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Cannot assign higher authority");
      }
      targetMembership.setRole(newRole);
    }

    return MemberResponse.fromEntity(targetMembership);
  }

  @Override
  @Transactional
  public void deleteMember(long communityId, long userId) {
    Long currentUserId = authUtilsComponent.getAuthenticatedUserId();

    CommunityMember currentUserMembership =
        communityMemberRepository
            .findWithRoleAndCommunityAndOwnerByKey(
                new CommunityMemberKey(communityId, currentUserId))
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.FORBIDDEN, "Access denied"));

    Community community = currentUserMembership.getCommunity();
    boolean isOwner = currentUserId.equals(community.getOwner().getId());
    boolean isSelf = currentUserId.equals(userId);

    CommunityMember targetMembership =
        communityMemberRepository
            .findWithRoleByKey(new CommunityMemberKey(communityId, userId))
            .orElseThrow(
                () -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Member not found"));

    if (community.getOwner().getId().equals(userId)) {
      throw new ResponseStatusException(HttpStatus.CONFLICT, "Cannot remove the community owner");
    }

    if (isOwner || isSelf) {
      communityMemberRepository.delete(targetMembership);
    } else {
      if (!currentUserMembership.getRole().getCanBanUsers()) {
        throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Permission denied");
      }
      if (targetMembership.getRole().getHierarchyLevel()
          <= currentUserMembership.getRole().getHierarchyLevel()) {
        throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Insufficient authority");
      }
      communityMemberRepository.delete(targetMembership);
    }
  }

  @Override
  @Transactional(readOnly = true)
  public List<MemberResponse> getMembersByCommunity(long communityId) {
    Long userId = authUtilsComponent.getAuthenticatedUserId();

    if (!communityMemberRepository.existsById(new CommunityMemberKey(communityId, userId))) {
      throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Access denied");
    }

    return communityMemberRepository
        .findAllWithUserRoleAndCommunityByKey_CommunityId(communityId)
        .stream()
        .map(MemberResponse::fromEntity)
        .toList();
  }

  @Override
  @Transactional(readOnly = true)
  public MemberResponse getMember(long communityId, long userId) {
    Long currentUserId = authUtilsComponent.getAuthenticatedUserId();

    if (!communityMemberRepository.existsById(new CommunityMemberKey(communityId, currentUserId))) {
      throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Access denied");
    }

    CommunityMember member =
        communityMemberRepository
            .findWithUserRoleAndCommunityByKey(new CommunityMemberKey(communityId, userId))
            .orElseThrow(
                () -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Member not found"));

    return MemberResponse.fromEntity(member);
  }
}
