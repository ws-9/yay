package com.ws.yay_backend.service;

import com.ws.yay_backend.request.CreateChannelMessageRequest;
import com.ws.yay_backend.response.GetChannelMessageResponse;

public interface ChannelMessageService {
  GetChannelMessageResponse createMessage(CreateChannelMessageRequest request);
}
