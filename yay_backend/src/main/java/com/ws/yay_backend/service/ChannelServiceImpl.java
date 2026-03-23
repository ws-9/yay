package com.ws.yay_backend.service;

import com.ws.yay_backend.components.AuthUtilsComponent;
import com.ws.yay_backend.dao.ChannelPermissionRepository;
import com.ws.yay_backend.dao.ChannelRepository;
import com.ws.yay_backend.dao.CommunityMemberRepository;
import com.ws.yay_backend.dao.CommunityRepository;
import com.ws.yay_backend.dao.CommunityRoleRepository;
import com.ws.yay_backend.dto.v1.request.CreateChannelPermissionRequest;
import com.ws.yay_backend.dto.v1.request.CreateChannelRequest;
import com.ws.yay_backend.dto.v1.request.RenameChannelRequest;
import com.ws.yay_backend.dto.v1.response.ChannelPermissionResponse;
import com.ws.yay_backend.dto.v1.response.GetChannelResponse;
import com.ws.yay_backend.dto.v2.request.ChannelBatchRequestV2;
import com.ws.yay_backend.dto.v2.request.CreateChannelRequestV2;
import com.ws.yay_backend.dto.v2.response.ChannelResponseV2;
import com.ws.yay_backend.entity.Channel;
import com.ws.yay_backend.entity.ChannelPermission;
import com.ws.yay_backend.entity.Community;
import com.ws.yay_backend.entity.CommunityMember;
import com.ws.yay_backend.entity.CommunityRole;
import com.ws.yay_backend.entity.embedded.ChannelPermissionKey;
import com.ws.yay_backend.entity.embedded.CommunityMemberKey;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.function.Function;
import java.util.stream.Collectors;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
public class ChannelServiceImpl implements ChannelService {
  private final ChannelRepository channelRepository;
  private final CommunityRepository communityRepository;
  private final CommunityMemberRepository communityMemberRepository;
  private final ChannelPermissionRepository channelPermissionRepository;
  private final CommunityRoleRepository communityRoleRepository;
  private final AuthUtilsComponent authUtilsComponent;

  public ChannelServiceImpl(
      ChannelRepository channelRepository,
      CommunityRepository communityRepository,
      CommunityMemberRepository communityMemberRepository,
      ChannelPermissionRepository channelPermissionRepository,
      CommunityRoleRepository communityRoleRepository,
      AuthUtilsComponent authUtilsComponent) {
    this.channelRepository = channelRepository;
    this.communityRepository = communityRepository;
    this.communityMemberRepository = communityMemberRepository;
    this.channelPermissionRepository = channelPermissionRepository;
    this.communityRoleRepository = communityRoleRepository;
    this.authUtilsComponent = authUtilsComponent;
  }

  @Override
  @Transactional
  public GetChannelResponse createChannel(CreateChannelRequest request) {
    Long userId = authUtilsComponent.getAuthenticatedUserId();
    boolean isAdmin = authUtilsComponent.isCurrentUserAdmin();

    Optional<CommunityMember> membership =
        communityMemberRepository.findWithRoleAndCommunityByKey(
            new CommunityMemberKey(request.communityId(), userId));

    if (membership.isEmpty() && !isAdmin) {
      throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Community not found");
    }

    boolean hasPermission = isAdmin || membership.get().getRole().getCanManageChannels();

    if (!hasPermission) {
      throw new ResponseStatusException(
          HttpStatus.FORBIDDEN, "You don't have permission to create channels");
    }

    Community community;
    if (membership.isPresent()) {
      community = membership.get().getCommunity();
    } else {
      // Admin without membership - fetch community
      community =
          communityRepository
              .findById(request.communityId())
              .orElseThrow(
                  () ->
                      new ResponseStatusException(
                          HttpStatus.NOT_FOUND, "Community not found: " + request.communityId()));
    }

    if (channelRepository.existsByNameAndCommunity_Id(request.name(), community.getId())) {
      throw new ResponseStatusException(
          HttpStatus.CONFLICT, "A channel with this name already exists in the community");
    }

    Channel channel = new Channel(request.name(), community, new ArrayList<>());
    Channel saved = channelRepository.save(channel);

    return new GetChannelResponse(
        saved.getId(),
        saved.getName(),
        saved.getCommunity().getId(),
        saved.getCommunity().getName());
  }

  @Override
  @Transactional(readOnly = true)
  public GetChannelResponse getChannel(long id) {
    Channel channel =
        channelRepository
            .findById(id)
            .orElseThrow(
                () ->
                    new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Channel not found with id: " + id));
    return new GetChannelResponse(
        channel.getId(),
        channel.getName(),
        channel.getCommunity().getId(),
        channel.getCommunity().getName());
  }

  @Override
  @Transactional
  public ChannelPermissionResponse upsertChannelPermission(
      long channelId, CreateChannelPermissionRequest request) {
    Long userId = authUtilsComponent.getAuthenticatedUserId();

    Channel channel =
        channelRepository
            .findWithCommunityById(channelId)
            .orElseThrow(
                () -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Channel not found"));

    CommunityMember membership =
        communityMemberRepository
            .findWithRoleByKey(new CommunityMemberKey(channel.getCommunity().getId(), userId))
            .orElseThrow(
                () -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Channel not found"));

    boolean hasPermission = membership.getRole().getCanManageChannels();
    if (!hasPermission) {
      throw new ResponseStatusException(
          HttpStatus.FORBIDDEN, "You don't have permission to manage channel permissions");
    }

    CommunityRole role =
        communityRoleRepository
            .findById(request.roleId())
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Role not found"));

    // Can only assign roles weaker than their own (higher hierarchy level)
    boolean roleIsWeaker = role.getHierarchyLevel() > membership.getRole().getHierarchyLevel();
    if (!roleIsWeaker) {
      throw new ResponseStatusException(
          HttpStatus.FORBIDDEN, "Cannot assign role equal to or stronger than your own");
    }

    ChannelPermissionKey key = new ChannelPermissionKey(channelId, request.roleId());

    ChannelPermission permission =
        channelPermissionRepository
            .findById(key)
            .orElseGet(() -> new ChannelPermission(channel, role, null, null));

    if (request.canRead() != null) {
      permission.setCanRead(request.canRead());
    }

    if (request.canWrite() != null) {
      permission.setCanWrite(request.canWrite());
    }

    if (permission.isDefault()) {
      channelPermissionRepository.deleteById(key);
      permission = ChannelPermission.createDefault(channel, role);
    } else {
      channelPermissionRepository.save(permission);
    }

    return ChannelPermissionResponse.fromEntity(permission);
  }

  @Override
  @Transactional(readOnly = true)
  public List<ChannelPermissionResponse> getChannelPermissions(long channelId) {
    Long userId = authUtilsComponent.getAuthenticatedUserId();

    Channel channel =
        channelRepository
            .findWithCommunityById(channelId)
            .orElseThrow(
                () -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Channel not found"));

    boolean isMember =
        communityMemberRepository.existsById(
            new CommunityMemberKey(channel.getCommunity().getId(), userId));
    if (!isMember) {
      throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Channel not found");
    }

    // Get all roles for the community
    List<CommunityRole> roles = communityRoleRepository.findAll();

    List<ChannelPermission> channelPermissions =
        channelPermissionRepository.findByKey_ChannelId(channelId);
    Map<Long, ChannelPermission> roleToPermissionMap =
        channelPermissions.stream()
            .collect(Collectors.toMap(p -> p.getKey().getRoleId(), Function.identity()));

    // For each role, get stored permission or return default
    return roles.stream()
        .map(
            role -> {
              ChannelPermission permission =
                  roleToPermissionMap.getOrDefault(
                      role.getId(), ChannelPermission.createDefault(channel, role));

              return ChannelPermissionResponse.fromEntity(permission);
            })
        .toList();
  }

  @Override
  @Transactional(readOnly = true)
  public ChannelPermissionResponse getChannelPermission(long channelId, long roleId) {
    Long userId = authUtilsComponent.getAuthenticatedUserId();

    Channel channel =
        channelRepository
            .findWithCommunityById(channelId)
            .orElseThrow(
                () -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Channel not found"));

    boolean isMember =
        communityMemberRepository.existsById(
            new CommunityMemberKey(channel.getCommunity().getId(), userId));
    if (!isMember) {
      throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Channel not found");
    }

    ChannelPermissionKey key = new ChannelPermissionKey(channelId, roleId);

    return channelPermissionRepository
        .findById(key)
        .map(ChannelPermissionResponse::fromEntity)
        .orElseGet(() -> new ChannelPermissionResponse(channelId, roleId, true, true));
  }

  @Override
  @Transactional
  public void deleteChannel(long channelId) {
    Long userId = authUtilsComponent.getAuthenticatedUserId();

    Channel channel =
        channelRepository
            .findWithCommunityById(channelId)
            .orElseThrow(
                () -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Channel not found"));

    CommunityMember membership =
        communityMemberRepository
            .findWithRoleByKey(new CommunityMemberKey(channel.getCommunity().getId(), userId))
            .orElseThrow(
                () -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Channel not found"));

    boolean hasPermission = membership.getRole().getCanManageChannels();
    if (!hasPermission) {
      throw new ResponseStatusException(
          HttpStatus.FORBIDDEN, "You don't have permission to manage channels");
    }

    channelRepository.delete(channel);
  }

  @Override
  @Transactional
  public GetChannelResponse renameChannel(long channelId, RenameChannelRequest request) {
    Long userId = authUtilsComponent.getAuthenticatedUserId();

    Channel channel =
        channelRepository
            .findWithCommunityById(channelId)
            .orElseThrow(
                () -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Channel not found"));

    CommunityMember membership =
        communityMemberRepository
            .findWithRoleByKey(new CommunityMemberKey(channel.getCommunity().getId(), userId))
            .orElseThrow(
                () -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Channel not found"));

    boolean hasPermission = membership.getRole().getCanManageChannels();
    if (!hasPermission) {
      throw new ResponseStatusException(
          HttpStatus.FORBIDDEN, "You don't have permission to manage channels");
    }

    channel.setName(request.name());

    return new GetChannelResponse(
        channel.getId(),
        channel.getName(),
        channel.getCommunity().getId(),
        channel.getCommunity().getName());
  }

  @Override
  @Transactional
  public ChannelResponseV2 createChannelV2(CreateChannelRequestV2 request) {
    Long userId = authUtilsComponent.getAuthenticatedUserId();

    CommunityMember membership =
        communityMemberRepository
            .findWithRoleAndCommunityByKey(new CommunityMemberKey(request.communityId(), userId))
            .orElseThrow(
                () ->
                    new ResponseStatusException(
                        HttpStatus.FORBIDDEN, "You don't have access to this community"));

    boolean hasPermission = membership.getRole().getCanManageChannels();

    if (!hasPermission) {
      throw new ResponseStatusException(
          HttpStatus.FORBIDDEN, "You don't have permission to create channels");
    }

    Community community = membership.getCommunity();

    if (channelRepository.existsByNameAndCommunity_Id(request.name(), community.getId())) {
      throw new ResponseStatusException(
          HttpStatus.CONFLICT, "A channel with this name already exists in the community");
    }

    Channel channel = new Channel(request.name(), community, new ArrayList<>());
    Channel saved = channelRepository.save(channel);

    return ChannelResponseV2.fromEntity(saved);
  }

  @Override
  @Transactional(readOnly = true)
  public ChannelResponseV2 getChannelV2(long id) {
    Long userId = authUtilsComponent.getAuthenticatedUserId();

    Channel channel =
        channelRepository
            .findWithCommunityById(id)
            .orElseThrow(
                () -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Channel not found"));

    boolean isMember =
        communityMemberRepository.existsById(
            new CommunityMemberKey(channel.getCommunity().getId(), userId));
    if (!isMember) {
      throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Channel not found");
    }

    return ChannelResponseV2.fromEntity(channel);
  }

  @Override
  @Transactional(readOnly = true)
  public List<ChannelResponseV2> getChannelsByCommunityV2(List<Long> communityIds) {
    Long userId = authUtilsComponent.getAuthenticatedUserId();

    return channelRepository.findChannelsByCommunityIdsAndUserId(communityIds, userId).stream()
        .map(ChannelResponseV2::fromEntity)
        .toList();
  }

  @Override
  @Transactional(readOnly = true)
  public List<ChannelResponseV2> getChannelsBatchV2(ChannelBatchRequestV2 request) {
    Long userId = authUtilsComponent.getAuthenticatedUserId();

    List<Channel> channels = channelRepository.findChannelsByIdsAndUserId(request.ids(), userId);

    return channels.stream().map(ChannelResponseV2::fromEntity).toList();
  }

  @Override
  @Transactional
  public void deleteChannelV2(long id) {
    Long userId = authUtilsComponent.getAuthenticatedUserId();

    Channel channel =
        channelRepository
            .findWithCommunityById(id)
            .orElseThrow(
                () -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Channel not found"));

    CommunityMember membership =
        communityMemberRepository
            .findWithRoleByKey(new CommunityMemberKey(channel.getCommunity().getId(), userId))
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.FORBIDDEN, "Access denied"));

    if (!membership.getRole().getCanManageChannels()) {
      throw new ResponseStatusException(
          HttpStatus.FORBIDDEN, "You don't have permission to delete channels");
    }

    channelRepository.delete(channel);
  }
}
