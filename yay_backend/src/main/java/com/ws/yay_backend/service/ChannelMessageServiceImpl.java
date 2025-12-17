package com.ws.yay_backend.service;

import com.ws.yay_backend.components.AuthUtilsComponent;
import com.ws.yay_backend.dao.ChannelMessageRepository;
import com.ws.yay_backend.dao.ChannelRepository;
import com.ws.yay_backend.entity.Channel;
import com.ws.yay_backend.entity.ChannelMessage;
import com.ws.yay_backend.entity.User;
import com.ws.yay_backend.dto.request.CreateChannelMessageRequest;
import com.ws.yay_backend.dto.response.GetChannelMessageResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
public class ChannelMessageServiceImpl implements ChannelMessageService {
  private final ChannelMessageRepository channelMessageRepository;
  private final ChannelRepository channelRepository;
  private final AuthUtilsComponent authUtilsComponent;

  @Autowired
  public ChannelMessageServiceImpl(ChannelMessageRepository channelMessageRepository, ChannelRepository channelRepository, AuthUtilsComponent authUtilsComponent) {
    this.channelMessageRepository = channelMessageRepository;
    this.channelRepository = channelRepository;
    this.authUtilsComponent = authUtilsComponent;
  }

  @Override
  @Transactional
  @PreAuthorize("""
      hasRole('ADMIN') or
      @channelRepository.existsByIdAndCommunity_Members_Id(#request.channelId, authentication.principal.id) or
      @channelRepository.existsByIdAndCommunity_Owner_Id(#request.channelId, authentication.principal.id)
      """)
  public GetChannelMessageResponse createMessage(CreateChannelMessageRequest request) {
    User user = authUtilsComponent.getAuthenticatedUser();

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
