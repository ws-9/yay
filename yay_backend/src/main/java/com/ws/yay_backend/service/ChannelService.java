package com.ws.yay_backend.service;

import com.ws.yay_backend.request.CreateChannelRequest;
import com.ws.yay_backend.response.GetChannelResponse;

public interface ChannelService {
  GetChannelResponse createChannel(CreateChannelRequest request);
}
