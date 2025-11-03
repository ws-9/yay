package com.ws.yay_backend.controller;

import com.ws.yay_backend.dto.broadcast.ChannelMessageBroadcast;
import com.ws.yay_backend.dto.event.CreateChannelMessageEvent;
import com.ws.yay_backend.dto.request.Message;
import com.ws.yay_backend.service.WebSocketService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

@Controller
public class WebSocketController {
  private final SimpMessagingTemplate simpMessagingTemplate;
  private final WebSocketService webSocketService;

  @Autowired
  public WebSocketController(WebSocketService webSocketService, SimpMessagingTemplate simpMessagingTemplate) {
    this.webSocketService = webSocketService;
    this.simpMessagingTemplate = simpMessagingTemplate;
  }

  @MessageMapping("/chat")
  public void chat(@Payload Message message) {
    simpMessagingTemplate.convertAndSendToUser(message.to(), "/topic", message);
  }

  @MessageMapping("/chat/{channelId}")
  @SendTo("/topic/channel/{channelId}")
  public ChannelMessageBroadcast sendMessage(
      @DestinationVariable Long channelId,
      @Payload CreateChannelMessageEvent event
  ) {
    return webSocketService.createMessage(channelId, event);
  }
}
