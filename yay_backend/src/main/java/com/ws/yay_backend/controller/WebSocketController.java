package com.ws.yay_backend.controller;

import com.ws.yay_backend.request.Message;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

@Controller
public class WebSocketController {
  private final SimpMessagingTemplate simpMessagingTemplate;

  @Autowired
  public WebSocketController(SimpMessagingTemplate simpMessagingTemplate) {
    this.simpMessagingTemplate = simpMessagingTemplate;
  }

  @MessageMapping("/chat")
  public void chat(@Payload Message message) {
    simpMessagingTemplate.convertAndSendToUser(message.to(), "/topic", message);
  }
}
