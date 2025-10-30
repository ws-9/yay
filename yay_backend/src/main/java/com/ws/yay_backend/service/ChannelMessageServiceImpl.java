package com.ws.yay_backend.service;

import com.ws.yay_backend.dao.ChannelMessageRepository;
import com.ws.yay_backend.dao.ChannelRepository;
import com.ws.yay_backend.dao.CommunityRepository;
import com.ws.yay_backend.dao.UserRepository;
import com.ws.yay_backend.entity.Channel;
import com.ws.yay_backend.entity.ChannelMessage;
import com.ws.yay_backend.entity.User;
import com.ws.yay_backend.request.CreateChannelMessageRequest;
import com.ws.yay_backend.response.GetChannelMessageResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
public class ChannelMessageServiceImpl implements ChannelMessageService {
  private final ChannelMessageRepository channelMessageRepository;
  private final ChannelRepository channelRepository;
  private final CommunityRepository communityRepository;
  private final UserRepository userRepository;

  @Autowired
  public ChannelMessageServiceImpl(ChannelMessageRepository channelMessageRepository, ChannelRepository channelRepository, CommunityRepository communityRepository, UserRepository userRepository) {
    this.channelMessageRepository = channelMessageRepository;
    this.channelRepository = channelRepository;
    this.communityRepository = communityRepository;
    this.userRepository = userRepository;
  }

  @Override
  @Transactional
  @PreAuthorize("""
      hasRole('ADMIN') or
      @channelRepository.existsByIdAndCommunity_Members_Id(#request.channelId, authentication.principal.id) or
      @channelRepository.existsByIdAndCommunity_Owner_Id(#request.channelId, authentication.principal.id)
      """)
  public GetChannelMessageResponse createMessage(CreateChannelMessageRequest request) {
    Authentication auth = SecurityContextHolder.getContext().getAuthentication();

    User user = userRepository.findByUsername(auth.getName())
        .orElseThrow(() -> new ResponseStatusException(
            HttpStatus.INTERNAL_SERVER_ERROR,
            "Authenticated user not found: " + auth.getName()
        ));

    Channel channel = channelRepository.findById((request.channelId()))
        .orElseThrow(() -> new ResponseStatusException(
            HttpStatus.NOT_FOUND,
            "Channel not found: " + request.channelId()
        ));

    ChannelMessage channelMessage = new ChannelMessage(request.message(), user, channel);
    ChannelMessage saved = channelMessageRepository.save(channelMessage);
    return new GetChannelMessageResponse(
        saved.getId(),
        saved.getMessage(),
        saved.getUser().getId(),
        saved.getChannel().getId()
    );
  }
}
