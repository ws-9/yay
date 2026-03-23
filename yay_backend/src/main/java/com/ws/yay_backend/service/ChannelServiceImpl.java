package com.ws.yay_backend.service;

import com.ws.yay_backend.components.AuthUtilsComponent;
import com.ws.yay_backend.dao.ChannelRepository;
import com.ws.yay_backend.dao.CommunityMemberRepository;
import com.ws.yay_backend.dto.request.ChannelBatchRequest;
import com.ws.yay_backend.dto.request.CreateChannelRequest;
import com.ws.yay_backend.dto.request.RenameChannelRequest;
import com.ws.yay_backend.dto.response.ChannelResponse;
import com.ws.yay_backend.entity.Channel;
import com.ws.yay_backend.entity.Community;
import com.ws.yay_backend.entity.CommunityMember;
import com.ws.yay_backend.entity.embedded.CommunityMemberKey;
import java.util.ArrayList;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
public class ChannelServiceImpl implements ChannelService {
  private final ChannelRepository channelRepository;
  private final CommunityMemberRepository communityMemberRepository;
  private final AuthUtilsComponent authUtilsComponent;

  public ChannelServiceImpl(
      ChannelRepository channelRepository,
      CommunityMemberRepository communityMemberRepository,
      AuthUtilsComponent authUtilsComponent) {
    this.channelRepository = channelRepository;
    this.communityMemberRepository = communityMemberRepository;
    this.authUtilsComponent = authUtilsComponent;
  }

  @Override
  @Transactional
  public ChannelResponse renameChannel(long channelId, RenameChannelRequest request) {
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

    return ChannelResponse.fromEntity(channel);
  }

  @Override
  @Transactional
  public ChannelResponse createChannel(CreateChannelRequest request) {
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

    return ChannelResponse.fromEntity(saved);
  }

  @Override
  @Transactional(readOnly = true)
  public ChannelResponse getChannel(long id) {
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

    return ChannelResponse.fromEntity(channel);
  }

  @Override
  @Transactional(readOnly = true)
  public List<ChannelResponse> getChannelsByCommunity(List<Long> communityIds) {
    Long userId = authUtilsComponent.getAuthenticatedUserId();

    return channelRepository.findChannelsByCommunityIdsAndUserId(communityIds, userId).stream()
        .map(ChannelResponse::fromEntity)
        .toList();
  }

  @Override
  @Transactional(readOnly = true)
  public List<ChannelResponse> getChannelsBatch(ChannelBatchRequest request) {
    Long userId = authUtilsComponent.getAuthenticatedUserId();

    List<Channel> channels = channelRepository.findChannelsByIdsAndUserId(request.ids(), userId);

    return channels.stream().map(ChannelResponse::fromEntity).toList();
  }

  @Override
  @Transactional
  public void deleteChannel(long id) {
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
