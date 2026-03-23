package com.ws.yay_backend.service;

import com.ws.yay_backend.dto.request.ChannelPermissionRequest;
import com.ws.yay_backend.dto.response.ChannelPermissionResponse;
import java.util.List;

public interface ChannelPermissionService {
  ChannelPermissionResponse getChannelPermission(long channelId, long roleId);

  List<ChannelPermissionResponse> getChannelPermissions(List<Long> communityIds);

  ChannelPermissionResponse upsertChannelPermission(ChannelPermissionRequest request);

  void deleteChannelPermission(long channelId, long roleId);
}
