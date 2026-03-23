package com.ws.yay_backend.service;

import com.ws.yay_backend.dto.request.ChannelBatchRequest;
import com.ws.yay_backend.dto.request.CreateChannelRequest;
import com.ws.yay_backend.dto.request.RenameChannelRequest;
import com.ws.yay_backend.dto.response.ChannelResponse;
import java.util.List;

public interface ChannelService {

  ChannelResponse renameChannel(long channelId, RenameChannelRequest request);

  // V2 Methods
  ChannelResponse createChannel(CreateChannelRequest request);

  ChannelResponse getChannel(long id);

  List<ChannelResponse> getChannelsByCommunity(List<Long> communityIds);

  List<ChannelResponse> getChannelsBatch(ChannelBatchRequest request);

  void deleteChannel(long id);
}
