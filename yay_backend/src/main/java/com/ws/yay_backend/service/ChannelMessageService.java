package com.ws.yay_backend.service;

import com.ws.yay_backend.dto.request.CreateChannelMessageRequest;
import com.ws.yay_backend.dto.response.GetChannelMessageResponse;

public interface ChannelMessageService {
  GetChannelMessageResponse createMessage(CreateChannelMessageRequest request);
}
