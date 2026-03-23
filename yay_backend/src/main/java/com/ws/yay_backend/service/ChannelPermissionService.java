package com.ws.yay_backend.service;

import com.ws.yay_backend.dto.request.ChannelPermissionRequestV2;
import com.ws.yay_backend.dto.response.ChannelPermissionResponseV2;
import java.util.List;

public interface ChannelPermissionService {
  ChannelPermissionResponseV2 getChannelPermissionV2(long channelId, long roleId);

  List<ChannelPermissionResponseV2> getChannelPermissionsV2(List<Long> communityIds);

  ChannelPermissionResponseV2 upsertChannelPermissionV2(ChannelPermissionRequestV2 request);

  void deleteChannelPermissionV2(long channelId, long roleId);
}
