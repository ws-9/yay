package com.ws.yay_backend.service;

import com.ws.yay_backend.components.AuthUtilsComponent;
import com.ws.yay_backend.dao.ChannelRepository;
import com.ws.yay_backend.dao.CommunityMemberRepository;
import com.ws.yay_backend.dao.CommunityRepository;
import com.ws.yay_backend.entity.Channel;
import com.ws.yay_backend.entity.Community;
import com.ws.yay_backend.dto.request.CreateChannelRequest;
import com.ws.yay_backend.dto.response.GetChannelResponse;
import com.ws.yay_backend.entity.CommunityMember;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.ArrayList;
import java.util.Optional;

@Service
public class ChannelServiceImpl implements ChannelService {
  private final ChannelRepository channelRepository;
  private final CommunityRepository communityRepository;
  private final CommunityMemberRepository communityMemberRepository;
  private final AuthUtilsComponent authUtilsComponent;

  public ChannelServiceImpl(ChannelRepository channelRepository, CommunityRepository communityRepository, CommunityMemberRepository communityMemberRepository, AuthUtilsComponent authUtilsComponent) {
    this.channelRepository = channelRepository;
    this.communityRepository = communityRepository;
    this.communityMemberRepository = communityMemberRepository;
    this.authUtilsComponent = authUtilsComponent;
  }

  @Override
  @Transactional
  public GetChannelResponse createChannel(CreateChannelRequest request) {
    Long userId = authUtilsComponent.getAuthenticatedUserId();
    boolean isAdmin = authUtilsComponent.isCurrentUserAdmin();

    Optional<CommunityMember> membership = communityMemberRepository.findWithRoleAndCommunityByKey_CommunityIdAndKey_UserId(request.communityId(), userId);

    if (membership.isEmpty() && !isAdmin) {
      throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Community not found");
    }

    boolean hasPermission = isAdmin || membership.get().getRole().getCanManageChannels();

    if (!hasPermission) {
      throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You don't have permission to create channels");
    }

    Community community;
    if (membership.isPresent()) {
      community = membership.get().getCommunity();
    } else {
      // Admin without membership - fetch community
      community = communityRepository.findById(request.communityId())
          .orElseThrow(() -> new ResponseStatusException(
              HttpStatus.NOT_FOUND,
              "Community not found: " + request.communityId()
          ));
    }

    if (channelRepository.existsByNameAndCommunity_Id(request.name(), community.getId())) {
      throw new ResponseStatusException(HttpStatus.CONFLICT, "A channel with this name already exists in the community");
    }

    Channel channel = new Channel(request.name(), community, new ArrayList<>());
    Channel saved = channelRepository.save(channel);

    return new GetChannelResponse(
        saved.getId(),
        saved.getName(),
        saved.getCommunity().getId(),
        saved.getCommunity().getName()
    );
  }

  @Override
  @Transactional(readOnly = true)
  public GetChannelResponse getChannel(long id) {
    Channel channel = channelRepository.findById(id)
        .orElseThrow(() -> new ResponseStatusException(
            HttpStatus.NOT_FOUND, "Channel not found with id: " + id
        ));
    return new GetChannelResponse(
        channel.getId(),
        channel.getName(),
        channel.getCommunity().getId(),
        channel.getCommunity().getName()
    );
  }
}
