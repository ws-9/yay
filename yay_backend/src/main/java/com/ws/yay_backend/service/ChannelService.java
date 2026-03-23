package com.ws.yay_backend.service;

import com.ws.yay_backend.dto.request.ChannelBatchRequestV2;
import com.ws.yay_backend.dto.request.CreateChannelRequestV2;
import com.ws.yay_backend.dto.request.RenameChannelRequest;
import com.ws.yay_backend.dto.response.ChannelResponseV2;
import java.util.List;

public interface ChannelService {

  ChannelResponseV2 renameChannel(long channelId, RenameChannelRequest request);

  // V2 Methods
  ChannelResponseV2 createChannelV2(CreateChannelRequestV2 request);

  ChannelResponseV2 getChannelV2(long id);

  List<ChannelResponseV2> getChannelsByCommunityV2(List<Long> communityIds);

  List<ChannelResponseV2> getChannelsBatchV2(ChannelBatchRequestV2 request);

  void deleteChannelV2(long id);
}
