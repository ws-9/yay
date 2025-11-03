package com.ws.yay_backend.service;

import com.ws.yay_backend.dto.broadcast.ChannelMessageBroadcast;
import com.ws.yay_backend.dto.event.CreateChannelMessageEvent;

public interface WebSocketService {
  ChannelMessageBroadcast createMessage(Long channelId, CreateChannelMessageEvent request);
}
