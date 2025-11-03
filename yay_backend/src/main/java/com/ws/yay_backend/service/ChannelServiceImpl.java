package com.ws.yay_backend.service;

import com.ws.yay_backend.dao.ChannelMessageRepository;
import com.ws.yay_backend.dao.ChannelRepository;
import com.ws.yay_backend.dao.CommunityRepository;
import com.ws.yay_backend.entity.Channel;
import com.ws.yay_backend.entity.Community;
import com.ws.yay_backend.dto.request.CreateChannelRequest;
import com.ws.yay_backend.dto.response.GetChannelMessageResponse;
import com.ws.yay_backend.dto.response.GetChannelResponse;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.ArrayList;
import java.util.List;

@Service
public class ChannelServiceImpl implements ChannelService {
  private final ChannelRepository channelRepository;
  private final CommunityRepository communityRepository;
  private final ChannelMessageRepository channelMessageRepository;

  public ChannelServiceImpl(ChannelRepository channelRepository, CommunityRepository communityRepository, ChannelMessageRepository channelMessageRepository) {
    this.channelRepository = channelRepository;
    this.communityRepository = communityRepository;
    this.channelMessageRepository = channelMessageRepository;
  }

  @Override
  @Transactional
  @PreAuthorize("""
      hasRole('ADMIN') or
      @communityRepository.existsByIdAndOwner_Id(#request.communityId, authentication.principal.id)
      """)
  public GetChannelResponse createChannel(CreateChannelRequest request) {
    Community community = communityRepository.findById(request.communityId())
        .orElseThrow(() -> new ResponseStatusException(
            HttpStatus.NOT_FOUND,
            "Community not found: " + request.communityId()
        ));

    Channel channel = new Channel(request.name(), community, new ArrayList<>());
    Channel saved = channelRepository.save(channel);

    return new GetChannelResponse(
        saved.getId(),
        saved.getName(),
        saved.getCommunity().getId()
    );
  }

  @Override
  @Transactional(readOnly = true)
  public List<GetChannelMessageResponse> getChannelMessages(long channelId) {
    return channelMessageRepository.findAllByChannel_Id(channelId).stream()
        .map(c -> new GetChannelMessageResponse(
           c.getId(),
           c.getMessage(),
           c.getUser().getId(),
           c.getChannel().getId()
        )).toList();
  }
}
