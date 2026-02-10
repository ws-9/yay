package com.ws.yay_backend.service;

import com.ws.yay_backend.components.AuthUtilsComponent;
import com.ws.yay_backend.dao.ChannelRepository;
import com.ws.yay_backend.dao.CommunityMemberRepository;
import com.ws.yay_backend.dao.CommunityRepository;
import com.ws.yay_backend.dao.CommunityRoleRepository;
import com.ws.yay_backend.dto.request.CreateCommunityRequest;
import com.ws.yay_backend.dto.response.*;
import com.ws.yay_backend.entity.Channel;
import com.ws.yay_backend.entity.Community;
import com.ws.yay_backend.entity.CommunityMember;
import com.ws.yay_backend.entity.CommunityRole;
import com.ws.yay_backend.entity.CommunityRoleName;
import com.ws.yay_backend.entity.User;
import com.ws.yay_backend.dto.request.TransferOwnershipRequest;
import com.ws.yay_backend.entity.embedded.CommunityMemberKey;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class CommunityServiceImpl implements CommunityService {
  private final CommunityRepository communityRepository;
  private final CommunityMemberRepository communityMemberRepository;
  private final CommunityRoleRepository communityRoleRepository;
  private final ChannelRepository channelRepository;
  private final AuthUtilsComponent authUtilsComponent;

  @Autowired
  public CommunityServiceImpl(
      CommunityRepository communityRepository,
      CommunityMemberRepository communityMemberRepository,
      CommunityRoleRepository communityRoleRepository,
      ChannelRepository channelRepository,
      AuthUtilsComponent authUtilsComponent
  ) {
    this.communityRepository = communityRepository;
    this.communityMemberRepository = communityMemberRepository;
    this.communityRoleRepository = communityRoleRepository;
    this.channelRepository = channelRepository;
    this.authUtilsComponent = authUtilsComponent;
  }

  @Override
  @Transactional(readOnly = true)
  public List<GetCommunityResponse> getAll() {
    List<Community> communities = communityRepository.findAllWithOwner();
    
    return communities.stream()
        .map(community -> new GetCommunityResponse(
            community.getId(),
            community.getName(),
            community.getOwner().getId(),
            community.getOwner().getUsername(),
            null,
            null
        ))
        .toList();
  }

  @Override
  @Transactional
  public GetCommunityResponse createCommunity(CreateCommunityRequest request) {
    User owner = authUtilsComponent.getAuthenticatedUser();

    Community community = new Community(request.name(), owner);
    Community saved = communityRepository.save(community);

    // Add owner as a member with Admin role
    CommunityRole adminRole = communityRoleRepository.findByName(CommunityRoleName.ADMIN.getValue())
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Admin role not found"));
    
    CommunityMember ownerMembership = new CommunityMember(saved, owner, adminRole);
    communityMemberRepository.save(ownerMembership);

    return new GetCommunityResponse(
        saved.getId(),
        saved.getName(),
        saved.getOwner().getId(),
        saved.getOwner().getUsername(),
        CommunityRoleResponse.fromEntity(adminRole),
        null
    );
  }

  @Override
  @Transactional(readOnly = true)
  public GetCommunityResponse getCommunity(long id) {
    Long userId = authUtilsComponent.getAuthenticatedUserId();
    
    Community community = communityRepository.findWithOwnerById(id)
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Community not found"));
    
    CommunityRoleResponse role = communityMemberRepository.findWithRoleByKey(new CommunityMemberKey(id, userId))
        .map(cm -> CommunityRoleResponse.fromEntity(cm.getRole()))
        .orElse(null);
    
    return new GetCommunityResponse(
        community.getId(),
        community.getName(),
        community.getOwner().getId(),
        community.getOwner().getUsername(),
        role,
        null
    );
  }

  @Override
  @Transactional
  public void deleteCommunity(long id) {
    Long userId = authUtilsComponent.getAuthenticatedUserId();
    
    Community community = communityRepository.findWithOwnerById(id)
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Community not found: " + id));
    
    boolean isOwner = community.getOwner().getId().equals(userId);
    boolean isAdmin = authUtilsComponent.isCurrentUserAdmin();
    
    if (!isOwner && !isAdmin) {
      throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Only the community owner can delete this community");
    }
    
    communityRepository.delete(community);
  }

  @Override
  @Transactional(readOnly = true)
  public List<GetMemberResponse> getAllMembers(Long id) {
    Long userId = authUtilsComponent.getAuthenticatedUserId();
    
    Community community = communityRepository.findWithOwnerById(id)
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Community not found: " + id));
    
    boolean isMember = communityMemberRepository.existsById(new CommunityMemberKey(id, userId));
    boolean isAdmin = authUtilsComponent.isCurrentUserAdmin();
    
    if (!isMember && !isAdmin) {
      throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You must be a member to view members");
    }
    
    List<CommunityMember> members = communityMemberRepository.findAllWithUserAndRoleByKey_CommunityId(id);
    
    return members.stream()
        .map(cm -> new GetMemberResponse(
            cm.getUser().getId(),
            cm.getUser().getUsername(),
            community.getId(),
            community.getName(),
            CommunityRoleResponse.fromEntity(cm.getRole())
        ))
        .toList();
  }

  @Override
  @Transactional(readOnly = true)
  public List<GetCommunityResponse> getUserOwnCommunities() {
    User user = authUtilsComponent.getAuthenticatedUser();

    List<Community> communities = communityRepository.findAllWithOwnerByMembers_User_id(user.getId());

    if (communities.isEmpty()) {
      return List.of();
    }

    List<Long> communityIds = communities.stream().map(Community::getId).toList();

    List<Channel> channels = channelRepository.findAllWithCommunityByCommunity_IdIn(communityIds);
    Map<Long, List<GetChannelResponse>> communityIdToChannels = channels.stream()
        .map(c -> new GetChannelResponse(
            c.getId(),
            c.getName(),
            c.getCommunity().getId(),
            c.getCommunity().getName()
        ))
        .collect(Collectors.groupingBy(
            GetChannelResponse::communityId
        ));
    
    Map<Long, CommunityRoleResponse> communityIdToRole = communityMemberRepository
        .findAllWithRoleByKey_UserIdAndKey_CommunityIdIn(user.getId(), communityIds).stream()
        .collect(Collectors.toMap(
            cm -> cm.getKey().getCommunityId(),
            cm -> CommunityRoleResponse.fromEntity(cm.getRole())
        ));

    return communities.stream()
        .map( c -> new GetCommunityResponse(
            c.getId(),
            c.getName(),
            c.getOwner().getId(),
            c.getOwner().getUsername(),
            communityIdToRole.getOrDefault(c.getId(), null),
            communityIdToChannels.getOrDefault(c.getId(), List.of())
        )).toList();
  }

  @Override
  @Transactional(readOnly = true)
  public List<GetChannelResponse> getCommunityChannels(Long communityId) {
    Long userId = authUtilsComponent.getAuthenticatedUserId();
    
    if (!communityRepository.existsById(communityId)) {
      throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Community not found: " + communityId);
    }
    
    boolean isMember = communityMemberRepository.existsById(new CommunityMemberKey(communityId, userId));
    boolean isAdmin = authUtilsComponent.isCurrentUserAdmin();
    
    if (!isMember && !isAdmin) {
      throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You must be a member to view channels");
    }
    
    return channelRepository.findAllWithCommunityByCommunity_Id(communityId).stream()
        .map(channel -> new GetChannelResponse(
            channel.getId(),
            channel.getName(),
            channel.getCommunity().getId(),
            channel.getCommunity().getName()
        )).toList();
  }

  @Override
  @Transactional(readOnly = true)
  public GetCommunityInviteResponse getCommunityInvite(long id) {
    Long userId = authUtilsComponent.getAuthenticatedUserId();

    CommunityMember membership = communityMemberRepository
        .findWithCommunityByKey(new CommunityMemberKey(id, userId))
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Community not found"));

    return new GetCommunityInviteResponse(membership.getCommunity().getInviteSlug());
  }

  @Override
  @Transactional
  public void transferOwnership(long communityId, TransferOwnershipRequest request) {
    Long userId = authUtilsComponent.getAuthenticatedUserId();

    CommunityMember membership = communityMemberRepository
        .findWithCommunityAndOwnerByKey(new CommunityMemberKey(communityId, userId))
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Community not found"));

    Community community = membership.getCommunity();

    if (!community.getOwner().getId().equals(userId)) {
      throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Only the community owner can transfer ownership");
    }

    if (request.newOwnerId() == userId) {
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Cannot transfer ownership to yourself");
    }

    CommunityMember newOwnerMembership = communityMemberRepository.findWithUserByKey(new CommunityMemberKey(communityId, request.newOwnerId()))
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User is not a member of this community"));

    CommunityRole adminRole = communityRoleRepository.findByName(CommunityRoleName.ADMIN.getValue())
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Admin role not found"));

    community.setOwner(newOwnerMembership.getUser());
    newOwnerMembership.setRole(adminRole);
  }
}
