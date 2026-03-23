package com.ws.yay_backend.service;

import com.ws.yay_backend.components.AuthUtilsComponent;
import com.ws.yay_backend.dao.CommunityMemberRepository;
import com.ws.yay_backend.dao.CommunityRepository;
import com.ws.yay_backend.dao.CommunityRoleRepository;
import com.ws.yay_backend.dto.request.CommunityBatchRequestV2;
import com.ws.yay_backend.dto.request.CreateCommunityRequestV2;
import com.ws.yay_backend.dto.request.RenameCommunityRequest;
import com.ws.yay_backend.dto.request.TransferOwnershipRequest;
import com.ws.yay_backend.dto.response.CommunityResponseV2;
import com.ws.yay_backend.entity.Community;
import com.ws.yay_backend.entity.CommunityMember;
import com.ws.yay_backend.entity.CommunityRole;
import com.ws.yay_backend.entity.CommunityRoleName;
import com.ws.yay_backend.entity.User;
import com.ws.yay_backend.entity.embedded.CommunityMemberKey;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
public class CommunityServiceImpl implements CommunityService {
  private final CommunityRepository communityRepository;
  private final CommunityMemberRepository communityMemberRepository;
  private final CommunityRoleRepository communityRoleRepository;
  private final AuthUtilsComponent authUtilsComponent;

  @Autowired
  public CommunityServiceImpl(
      CommunityRepository communityRepository,
      CommunityMemberRepository communityMemberRepository,
      CommunityRoleRepository communityRoleRepository,
      AuthUtilsComponent authUtilsComponent) {
    this.communityRepository = communityRepository;
    this.communityMemberRepository = communityMemberRepository;
    this.communityRoleRepository = communityRoleRepository;
    this.authUtilsComponent = authUtilsComponent;
  }

  @Override
  @Transactional
  public void transferOwnership(long communityId, TransferOwnershipRequest request) {
    Long userId = authUtilsComponent.getAuthenticatedUserId();

    CommunityMember membership =
        communityMemberRepository
            .findWithCommunityAndOwnerByKey(new CommunityMemberKey(communityId, userId))
            .orElseThrow(
                () -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Community not found"));

    Community community = membership.getCommunity();

    if (!community.getOwner().getId().equals(userId)) {
      throw new ResponseStatusException(
          HttpStatus.FORBIDDEN, "Only the community owner can transfer ownership");
    }

    if (request.newOwnerId() == userId) {
      throw new ResponseStatusException(
          HttpStatus.BAD_REQUEST, "Cannot transfer ownership to yourself");
    }

    CommunityMember newOwnerMembership =
        communityMemberRepository
            .findWithUserByKey(new CommunityMemberKey(communityId, request.newOwnerId()))
            .orElseThrow(
                () ->
                    new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "User is not a member of this community"));

    CommunityRole adminRole =
        communityRoleRepository
            .findByName(CommunityRoleName.ADMIN.getValue())
            .orElseThrow(
                () ->
                    new ResponseStatusException(
                        HttpStatus.INTERNAL_SERVER_ERROR, "Admin role not found"));

    community.setOwner(newOwnerMembership.getUser());
    newOwnerMembership.setRole(adminRole);
  }

  @Override
  @Transactional
  public CommunityResponseV2 renameCommunity(long communityId, RenameCommunityRequest request) {
    Long userId = authUtilsComponent.getAuthenticatedUserId();

    Community community =
        communityRepository
            .findWithOwnerById(communityId)
            .orElseThrow(
                () ->
                    new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Community not found: " + communityId));

    boolean isOwner = community.getOwner().getId().equals(userId);
    if (!isOwner) {
      throw new ResponseStatusException(
          HttpStatus.FORBIDDEN, "Only the community owner can delete this community");
    }

    community.setName(request.name());

    return CommunityResponseV2.fromEntity(community);
  }

  @Override
  @Transactional(readOnly = true)
  public List<CommunityResponseV2> getJoinedCommunitiesV2() {
    Long userId = authUtilsComponent.getAuthenticatedUserId();
    return communityRepository.findAllWithOwnerByMembers_User_id(userId).stream()
        .map(CommunityResponseV2::fromEntity)
        .toList();
  }

  @Override
  @Transactional
  public CommunityResponseV2 createCommunityV2(CreateCommunityRequestV2 request) {
    User owner = authUtilsComponent.getAuthenticatedUser();

    Community community = new Community(request.name(), owner);
    Community saved = communityRepository.save(community);

    // Add owner as a member with Admin role
    CommunityRole adminRole =
        communityRoleRepository
            .findByName(CommunityRoleName.ADMIN.getValue())
            .orElseThrow(
                () ->
                    new ResponseStatusException(
                        HttpStatus.INTERNAL_SERVER_ERROR, "Admin role not found"));

    CommunityMember ownerMembership = new CommunityMember(saved, owner, adminRole);
    communityMemberRepository.save(ownerMembership);

    return CommunityResponseV2.fromEntity(saved);
  }

  @Override
  @Transactional(readOnly = true)
  public CommunityResponseV2 getCommunityV2(long id) {
    Long userId = authUtilsComponent.getAuthenticatedUserId();

    Community community =
        communityRepository
            .findWithOwnerById(id)
            .orElseThrow(
                () -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Community not found"));

    boolean isMember = communityMemberRepository.existsById(new CommunityMemberKey(id, userId));
    if (!isMember) {
      throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Community not found");
    }

    return CommunityResponseV2.fromEntity(community);
  }

  @Override
  @Transactional(readOnly = true)
  public List<CommunityResponseV2> getCommunitiesBatchV2(CommunityBatchRequestV2 request) {
    Long userId = authUtilsComponent.getAuthenticatedUserId();
    return communityRepository.findCommunitiesByIdsAndUserId(request.ids(), userId).stream()
        .map(CommunityResponseV2::fromEntity)
        .toList();
  }

  @Override
  @Transactional
  public void deleteCommunityV2(long id) {
    Long userId = authUtilsComponent.getAuthenticatedUserId();

    Community community =
        communityRepository
            .findWithOwnerById(id)
            .orElseThrow(
                () -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Community not found"));

    boolean isOwner = community.getOwner().getId().equals(userId);
    if (!isOwner) {
      throw new ResponseStatusException(
          HttpStatus.FORBIDDEN, "Only the community owner can delete this community");
    }

    communityRepository.delete(community);
  }
}
