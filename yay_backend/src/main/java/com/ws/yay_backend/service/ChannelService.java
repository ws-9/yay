package com.ws.yay_backend.service;

import com.ws.yay_backend.dto.request.CreateChannelRequest;
import com.ws.yay_backend.dto.response.GetChannelMessageResponse;
import com.ws.yay_backend.dto.response.GetChannelResponse;

import java.util.List;

public interface ChannelService {
  GetChannelResponse createChannel(CreateChannelRequest request);

  List<GetChannelMessageResponse> getChannelMessages(long channelId);
}
