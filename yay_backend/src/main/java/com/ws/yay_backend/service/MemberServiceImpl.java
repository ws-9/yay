package com.ws.yay_backend.service;

import com.ws.yay_backend.components.AuthUtilsComponent;
import com.ws.yay_backend.dao.CommunityMemberRepository;
import com.ws.yay_backend.dao.CommunityRepository;
import com.ws.yay_backend.dao.CommunityRoleRepository;
import com.ws.yay_backend.entity.Community;
import com.ws.yay_backend.entity.CommunityMember;
import com.ws.yay_backend.entity.CommunityRole;
import com.ws.yay_backend.entity.CommunityRoleName;
import com.ws.yay_backend.entity.User;
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
import java.util.Set;
import java.util.stream.Collectors;


@Service
public class MemberServiceImpl implements MemberService {
  private final CommunityRepository communityRepository;
  private final CommunityMemberRepository communityMemberRepository;
  private final CommunityRoleRepository communityRoleRepository;
  private final AuthUtilsComponent authUtilsComponent;

  public MemberServiceImpl(
      CommunityRepository communityRepository,
      CommunityMemberRepository communityMemberRepository,
      CommunityRoleRepository communityRoleRepository,
      AuthUtilsComponent authUtilsComponent
  ) {
    this.communityRepository = communityRepository;
    this.communityMemberRepository = communityMemberRepository;
    this.communityRoleRepository = communityRoleRepository;
    this.authUtilsComponent = authUtilsComponent;
  }

  @Override
  @Transactional
  // TODO: implement banned_users table and check current user against it.
  public JoinCommunityResponse joinCommunity(JoinCommunityRequest request) {
    User user = authUtilsComponent.getAuthenticatedUser();

    Community community = communityRepository.findById(request.communityId())
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Community not found: " + request.communityId()));

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
    boolean isMember = communityMemberRepository.existsByKey_CommunityIdAndKey_UserId(communityId, userId);

    if (!isAdmin && !isMember) {
      throw new ResponseStatusException(
          HttpStatus.NOT_FOUND,
          "Community not found: " + communityId
      );
    }

    List<CommunityMember> members = communityMemberRepository
        .findAllWithRoleByKey_CommunityIdAndKey_UserIdIn(communityId, userIds);

    Set<Long> foundUserIds = members.stream()
        .map(m -> m.getKey().getUserId())
        .collect(Collectors.toSet());

    Map<Long, CommunityRoleResponse> rolesMap = members.stream()
        .collect(Collectors.toMap(
            m -> m.getKey().getUserId(),
            m -> CommunityRoleResponse.fromEntity(m.getRole())
        ));

    List<Long> notFound = userIds.stream()
        .filter(id -> !foundUserIds.contains(id))
        .toList();

    return new GetMembersRolesResponse(rolesMap, notFound);
  }
}