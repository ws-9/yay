package com.ws.yay_backend.service;

import com.ws.yay_backend.components.AuthUtilsComponent;
import com.ws.yay_backend.dao.BannedUserRepository;
import com.ws.yay_backend.dao.CommunityMemberRepository;
import com.ws.yay_backend.dao.CommunityRepository;
import com.ws.yay_backend.dao.CommunityRoleRepository;
import com.ws.yay_backend.dto.request.UpdateRoleRequest;
import com.ws.yay_backend.dto.response.GetMemberResponse;
import com.ws.yay_backend.entity.BannedUser;
import com.ws.yay_backend.entity.Community;
import com.ws.yay_backend.entity.CommunityMember;
import com.ws.yay_backend.entity.CommunityRole;
import com.ws.yay_backend.entity.CommunityRoleName;
import com.ws.yay_backend.entity.User;
import com.ws.yay_backend.entity.embedded.BannedUserKey;
import com.ws.yay_backend.entity.embedded.CommunityMemberKey;
import com.ws.yay_backend.dto.request.JoinCommunityRequest;
import com.ws.yay_backend.dto.request.RemoveMemberRequest;
import com.ws.yay_backend.dto.response.CommunityRoleResponse;
import com.ws.yay_backend.dto.response.GetMembersRolesResponse;
import com.ws.yay_backend.dto.response.JoinCommunityResponse;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;


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
      AuthUtilsComponent authUtilsComponent
  ) {
    this.communityRepository = communityRepository;
    this.communityMemberRepository = communityMemberRepository;
    this.communityRoleRepository = communityRoleRepository;
    this.bannedUserRepository = bannedUserRepository;
    this.authUtilsComponent = authUtilsComponent;
  }

  @Override
  @Transactional
  public JoinCommunityResponse joinCommunity(JoinCommunityRequest request) {
    User user = authUtilsComponent.getAuthenticatedUser();

    Community community = communityRepository.findById(request.communityId())
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Community not found: " + request.communityId()));

    // Check if user is banned from this community
    BannedUserKey bannedKey = new BannedUserKey(request.communityId(), user.getId());
    if (bannedUserRepository.existsById(bannedKey)) {
      throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You are banned from this community");
    }

    boolean alreadyMember = communityMemberRepository
        .existsById(new CommunityMemberKey(request.communityId(), user.getId()));

    if (!alreadyMember) {
      CommunityRole memberRole = communityRoleRepository.findByName(CommunityRoleName.MEMBER.getValue())
          .orElseThrow(() -> new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Default member role not found"));

      CommunityMember communityMember = new CommunityMember(community, user, memberRole);
      communityMemberRepository.save(communityMember);
    }

    return new JoinCommunityResponse(user.getId(), user.getUsername(), !alreadyMember);
  }

  @Override
  @Transactional
  public void deleteMember(RemoveMemberRequest request) {
    boolean isAdmin = authUtilsComponent.isCurrentUserAdmin();

    if (isAdmin) {
      Community community = communityRepository.findWithOwnerById(request.communityId())
          .orElseThrow(() -> new ResponseStatusException(
              HttpStatus.NOT_FOUND,
              "Community not found: " + request.communityId()
          ));

      CommunityMemberKey key = new CommunityMemberKey(request.communityId(), request.userId());

      CommunityMember toBeRemovedMember = communityMemberRepository.findById(key)
          .orElseThrow(() -> new ResponseStatusException(
              HttpStatus.NOT_FOUND,
              "Member not found: " + request.userId()
          ));

      boolean isCommunityOwner = community.getOwner().getId().equals(request.userId());

      if (isCommunityOwner) {
        throw new ResponseStatusException(HttpStatus.CONFLICT, "Cannot remove the community owner");
      }

      communityMemberRepository.delete(toBeRemovedMember);

      return;
    }

    Long userId = authUtilsComponent.getAuthenticatedUserId();

    // if user is not a member, just throw a NOT FOUND
    CommunityMember membership = communityMemberRepository.
        findWithRoleAndCommunityAndOwnerByKey(new CommunityMemberKey(request.communityId(), userId))
        .orElseThrow(() -> new ResponseStatusException(
            HttpStatus.NOT_FOUND,
            "Community id not found in database: " + request.communityId()
        ));

    boolean isSelf = userId.equals(request.userId());
    boolean hasPrivilege = membership.getRole().getCanBanUsers();

    if (!isSelf && !hasPrivilege) {
      throw new ResponseStatusException(
          HttpStatus.FORBIDDEN,
          "You don't have permission to remove users"
      );
    }

    CommunityMemberKey key = new CommunityMemberKey(request.communityId(), request.userId());

    CommunityMember toBeRemovedMember = communityMemberRepository
        .findWithRoleByKey(key)
        .orElseThrow(() -> new ResponseStatusException(
            HttpStatus.NOT_FOUND,
            "Member not found: " + request.userId()
        ));

    boolean isCommunityOwner = membership.getCommunity().getOwner().getId().equals(request.userId());

    if (isCommunityOwner) {
      throw new ResponseStatusException(HttpStatus.CONFLICT, "Cannot remove the community owner");
    }

    if (!isSelf) {
      boolean hasSufficientHierarchy = toBeRemovedMember.getRole().getHierarchyLevel() > membership.getRole().getHierarchyLevel();

      if (!hasSufficientHierarchy) {
        throw new ResponseStatusException(
            HttpStatus.FORBIDDEN,
            "You don't have permission to remove users of higher hierarchy"
        );
      }
    }

    communityMemberRepository.delete(toBeRemovedMember);
  }

  @Override
  @Transactional(readOnly = true)
  public GetMembersRolesResponse getRolesByUserIds(Long communityId, List<Long> userIds) {
    Long userId = authUtilsComponent.getAuthenticatedUserId();

    boolean communityExists = communityRepository.existsById(communityId);
    if (!communityExists) {
      throw new ResponseStatusException(
          HttpStatus.NOT_FOUND,
          "Community not found: " + communityId
      );
    }

    boolean isAdmin = authUtilsComponent.isCurrentUserAdmin();
    boolean isMember = communityMemberRepository.existsById(
        new CommunityMemberKey(communityId, userId)
    );

    if (!isAdmin && !isMember) {
      throw new ResponseStatusException(
          HttpStatus.NOT_FOUND,
          "Community not found: " + communityId
      );
    }

    List<CommunityMember> members = communityMemberRepository
        .findAllWithRoleByKey_CommunityIdAndKey_UserIdIn(communityId, userIds);

    Map<Long, CommunityRoleResponse> rolesMap = members.stream()
        .collect(Collectors.toMap(
            m -> m.getKey().getUserId(),
            m -> CommunityRoleResponse.fromEntity(m.getRole())
        ));

    // for not found users, set null
    userIds.forEach(id -> rolesMap.putIfAbsent(id, null));

    return new GetMembersRolesResponse(rolesMap);
  }

  @Override
  @Transactional
  public GetMemberResponse updateRole(UpdateRoleRequest request) {
    Long userId = authUtilsComponent.getAuthenticatedUserId();

    CommunityMember membership = communityMemberRepository
        .findWithUserAndRoleAndCommunityAndOwnerByKey(new CommunityMemberKey(request.communityId(), userId))
        .orElseThrow(() -> new ResponseStatusException(
            HttpStatus.NOT_FOUND,
            "Community not found with id: " + request.communityId()
        ));

    Community community = membership.getCommunity();

    CommunityRole newRole = communityRoleRepository.findByName(request.role())
        .orElseThrow(() -> new ResponseStatusException(
            HttpStatus.NOT_FOUND,
            "Role not found with name: " + request.role()
        ));

    boolean isOwner = userId.equals(community.getOwner().getId());
    boolean isTargetOwner = community.getOwner().getId().equals(request.userId());
    boolean isTargetSelf = userId.equals(request.userId());

    if (isTargetOwner) {
      throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Cannot change role of community owner");
    }

    // Owner should be able to change anyone's role without question.
    if (isOwner) {
      CommunityMember targetMembership = communityMemberRepository
          .findWithUserByKey(new CommunityMemberKey(request.communityId(), request.userId()))
          .orElseThrow(() -> new ResponseStatusException(
             HttpStatus.NOT_FOUND, "User not found with id: " + request.userId()
          ));

      targetMembership.setRole(newRole);

      return new GetMemberResponse(
          targetMembership.getUser().getId(),
          targetMembership.getUser().getUsername(),
          community.getId(),
          community.getName(),
          CommunityRoleResponse.fromEntity(newRole)
      );
    }

    // You should always be able to demote yourself
    if (isTargetSelf) {
      if (newRole.getHierarchyLevel() <= membership.getRole().getHierarchyLevel()) {
        throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You can only demote yourself, not promote or stay at the same role");
      }

      membership.setRole(newRole);

      return new GetMemberResponse(
          membership.getUser().getId(),
          membership.getUser().getUsername(),
          community.getId(),
          community.getName(),
          CommunityRoleResponse.fromEntity(newRole)
      );
    }

    // Otherwise, compare hierarchy levels

    CommunityMember targetMembership = communityMemberRepository
        .findWithUserByKey(new CommunityMemberKey(request.communityId(), request.userId()))
        .orElseThrow(() -> new ResponseStatusException(
            HttpStatus.NOT_FOUND, "User not found with id: " + request.userId()
        ));

    boolean canManageRoles = membership.getRole().getCanManageRoles();
    if (!canManageRoles) {
      throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You cannot change roles");
    }

    // Can only change roles of users with lower authority (higher hierarchy level)
    boolean targetHasLowerAuthority = targetMembership.getRole().getHierarchyLevel() > membership.getRole().getHierarchyLevel();
    if (!targetHasLowerAuthority) {
      throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Cannot change role of user with equal or higher authority");
    }

    // Can only assign roles weaker than their own (higher hierarchy level)
    boolean newRoleIsWeaker = newRole.getHierarchyLevel() > membership.getRole().getHierarchyLevel();
    if (!newRoleIsWeaker) {
      throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Cannot assign role equal to or stronger than your own");
    }

    targetMembership.setRole(newRole);

    return new GetMemberResponse(
        targetMembership.getUser().getId(),
        targetMembership.getUser().getUsername(),
        community.getId(),
        community.getName(),
        CommunityRoleResponse.fromEntity(newRole)
    );
  }
}