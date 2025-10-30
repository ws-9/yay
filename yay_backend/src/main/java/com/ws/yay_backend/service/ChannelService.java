package com.ws.yay_backend.service;

import com.ws.yay_backend.request.CreateChannelRequest;
import com.ws.yay_backend.response.GetChannelMessageResponse;
import com.ws.yay_backend.response.GetChannelResponse;

import java.util.List;

public interface ChannelService {
  GetChannelResponse createChannel(CreateChannelRequest request);

  List<GetChannelMessageResponse> getChannelMessages(long channelId);
}
