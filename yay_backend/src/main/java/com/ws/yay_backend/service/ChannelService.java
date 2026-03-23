package com.ws.yay_backend.service;

import com.ws.yay_backend.dto.v1.request.CreateChannelPermissionRequest;
import com.ws.yay_backend.dto.v1.request.CreateChannelRequest;
import com.ws.yay_backend.dto.v1.request.RenameChannelRequest;
import com.ws.yay_backend.dto.v1.response.ChannelPermissionResponse;
import com.ws.yay_backend.dto.v1.response.GetChannelResponse;
import com.ws.yay_backend.dto.v2.request.ChannelBatchRequestV2;
import com.ws.yay_backend.dto.v2.request.CreateChannelRequestV2;
import com.ws.yay_backend.dto.v2.response.ChannelResponseV2;
import java.util.List;

public interface ChannelService {
  GetChannelResponse createChannel(CreateChannelRequest request);

  GetChannelResponse getChannel(long id);

  ChannelPermissionResponse upsertChannelPermission(
      long channelId, CreateChannelPermissionRequest request);

  List<ChannelPermissionResponse> getChannelPermissions(long channelId);

  ChannelPermissionResponse getChannelPermission(long channelId, long roleId);

  void deleteChannel(long channelId);

  GetChannelResponse renameChannel(long channelId, RenameChannelRequest request);

  // V2 Methods
  ChannelResponseV2 createChannelV2(CreateChannelRequestV2 request);

  ChannelResponseV2 getChannelV2(long id);

  List<ChannelResponseV2> getChannelsByCommunityV2(List<Long> communityIds);

  List<ChannelResponseV2> getChannelsBatchV2(ChannelBatchRequestV2 request);

  void deleteChannelV2(long id);
}
