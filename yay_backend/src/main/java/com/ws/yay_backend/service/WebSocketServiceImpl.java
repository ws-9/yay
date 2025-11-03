package com.ws.yay_backend.service;

import com.ws.yay_backend.dao.ChannelMessageRepository;
import com.ws.yay_backend.dao.ChannelRepository;
import com.ws.yay_backend.dao.UserRepository;
import com.ws.yay_backend.dto.broadcast.ChannelMessageBroadcast;
import com.ws.yay_backend.dto.event.CreateChannelMessageEvent;
import com.ws.yay_backend.entity.Channel;
import com.ws.yay_backend.entity.ChannelMessage;
import com.ws.yay_backend.entity.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
public class WebSocketServiceImpl implements  WebSocketService {
  private final ChannelMessageRepository channelMessageRepository;
  private final ChannelRepository channelRepository;
  private final UserRepository userRepository;

  @Autowired
  public WebSocketServiceImpl(ChannelMessageRepository channelMessageRepository, ChannelRepository channelRepository, UserRepository userRepository) {
    this.channelMessageRepository = channelMessageRepository;
    this.channelRepository = channelRepository;
    this.userRepository = userRepository;
  }

  @Override
  public ChannelMessageBroadcast createMessage(Long channelId, CreateChannelMessageEvent event) {
    if (event.message() == null || event.message().isBlank()) {
      throw new RuntimeException("Message cannot be empty");
    }

    Authentication auth = SecurityContextHolder.getContext().getAuthentication();
    User user = userRepository.findByUsername(auth.getName())
        .orElseThrow(() -> new RuntimeException("Authenticated user not found: " + auth.getName()));

    Channel channel = channelRepository.findById(channelId)
        .orElseThrow(() -> new RuntimeException("Channel not found: " + channelId));

    boolean isMember = channelRepository.existsByIdAndCommunity_Members_Id(channelId, user.getId());
    if (!isMember) {
      throw new RuntimeException("User is not member");
    }

    ChannelMessage message = new ChannelMessage(event.message(), user, channel);
    ChannelMessage saved = channelMessageRepository.save(message);

    return new ChannelMessageBroadcast(
        saved.getId(),
        saved.getMessage(),
        saved.getUser().getId(),
        saved.getChannel().getId()
    );
  }
}
