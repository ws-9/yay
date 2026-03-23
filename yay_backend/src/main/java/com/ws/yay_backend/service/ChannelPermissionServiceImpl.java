package com.ws.yay_backend.service;

import com.ws.yay_backend.components.AuthUtilsComponent;
import com.ws.yay_backend.dao.ChannelPermissionRepository;
import com.ws.yay_backend.dao.ChannelRepository;
import com.ws.yay_backend.dao.CommunityMemberRepository;
import com.ws.yay_backend.dao.CommunityRoleRepository;
import com.ws.yay_backend.dto.v2.request.ChannelPermissionRequestV2;
import com.ws.yay_backend.dto.v2.response.ChannelPermissionResponseV2;
import com.ws.yay_backend.entity.Channel;
import com.ws.yay_backend.entity.ChannelPermission;
import com.ws.yay_backend.entity.CommunityMember;
import com.ws.yay_backend.entity.CommunityRole;
import com.ws.yay_backend.entity.embedded.ChannelPermissionKey;
import com.ws.yay_backend.entity.embedded.CommunityMemberKey;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
public class ChannelPermissionServiceImpl implements ChannelPermissionService {
  private final ChannelRepository channelRepository;
  private final CommunityMemberRepository communityMemberRepository;
  private final ChannelPermissionRepository channelPermissionRepository;
  private final CommunityRoleRepository communityRoleRepository;
  private final AuthUtilsComponent authUtilsComponent;

  public ChannelPermissionServiceImpl(
      ChannelRepository channelRepository,
      CommunityMemberRepository communityMemberRepository,
      ChannelPermissionRepository channelPermissionRepository,
      CommunityRoleRepository communityRoleRepository,
      AuthUtilsComponent authUtilsComponent) {
    this.channelRepository = channelRepository;
    this.communityMemberRepository = communityMemberRepository;
    this.channelPermissionRepository = channelPermissionRepository;
    this.communityRoleRepository = communityRoleRepository;
    this.authUtilsComponent = authUtilsComponent;
  }

  @Override
  @Transactional(readOnly = true)
  public ChannelPermissionResponseV2 getChannelPermissionV2(long channelId, long roleId) {
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
      throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Access denied");
    }

    ChannelPermissionKey key = new ChannelPermissionKey(channelId, roleId);

    return channelPermissionRepository
        .findById(key)
        .map(ChannelPermissionResponseV2::fromEntity)
        .orElseGet(() -> new ChannelPermissionResponseV2(channelId, roleId, true, true));
  }

  @Override
  @Transactional(readOnly = true)
  public List<ChannelPermissionResponseV2> getChannelPermissionsV2(List<Long> communityIds) {
    Long userId = authUtilsComponent.getAuthenticatedUserId();

    return channelPermissionRepository
        .findPermissionsByCommunityIdsAndUserId(communityIds, userId)
        .stream()
        .map(ChannelPermissionResponseV2::fromEntity)
        .toList();
  }

  @Override
  @Transactional
  public ChannelPermissionResponseV2 upsertChannelPermissionV2(ChannelPermissionRequestV2 request) {
    Long userId = authUtilsComponent.getAuthenticatedUserId();

    Channel channel =
        channelRepository
            .findWithCommunityById(request.channelId())
            .orElseThrow(
                () -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Channel not found"));

    CommunityMember membership =
        communityMemberRepository
            .findWithRoleByKey(new CommunityMemberKey(channel.getCommunity().getId(), userId))
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.FORBIDDEN, "Access denied"));

    if (!membership.getRole().getCanManageChannels()) {
      throw new ResponseStatusException(
          HttpStatus.FORBIDDEN, "You don't have permission to manage channel permissions");
    }

    CommunityRole role =
        communityRoleRepository
            .findById(request.roleId())
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Role not found"));

    // Can only assign roles weaker than their own (higher hierarchy level)
    if (role.getHierarchyLevel() <= membership.getRole().getHierarchyLevel()) {
      throw new ResponseStatusException(
          HttpStatus.FORBIDDEN, "Cannot assign role equal to or stronger than your own");
    }

    ChannelPermissionKey key = new ChannelPermissionKey(request.channelId(), request.roleId());

    ChannelPermission permission =
        channelPermissionRepository
            .findById(key)
            .orElseGet(() -> new ChannelPermission(channel, role, null, null));

    permission.setCanRead(request.canRead());
    permission.setCanWrite(request.canWrite());

    if (permission.isDefault()) {
      channelPermissionRepository.deleteById(key);
      permission = ChannelPermission.createDefault(channel, role);
    } else {
      channelPermissionRepository.save(permission);
    }

    return ChannelPermissionResponseV2.fromEntity(permission);
  }

  @Override
  @Transactional
  public void deleteChannelPermissionV2(long channelId, long roleId) {
    Long userId = authUtilsComponent.getAuthenticatedUserId();

    Channel channel =
        channelRepository
            .findWithCommunityById(channelId)
            .orElseThrow(
                () -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Channel not found"));

    CommunityMember membership =
        communityMemberRepository
            .findWithRoleByKey(new CommunityMemberKey(channel.getCommunity().getId(), userId))
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.FORBIDDEN, "Access denied"));

    if (!membership.getRole().getCanManageChannels()) {
      throw new ResponseStatusException(
          HttpStatus.FORBIDDEN, "You don't have permission to manage channel permissions");
    }

    ChannelPermissionKey key = new ChannelPermissionKey(channelId, roleId);
    channelPermissionRepository.deleteById(key);
  }
}
