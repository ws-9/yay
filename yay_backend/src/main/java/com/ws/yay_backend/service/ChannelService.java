package com.ws.yay_backend.service;

import com.ws.yay_backend.dto.request.CreateChannelRequest;
import com.ws.yay_backend.dto.request.CreateChannelPermissionRequest;
import com.ws.yay_backend.dto.request.RenameChannelRequest;
import com.ws.yay_backend.dto.response.ChannelPermissionResponse;
import com.ws.yay_backend.dto.response.GetChannelResponse;

import java.util.List;

public interface ChannelService {
  GetChannelResponse createChannel(CreateChannelRequest request);

  GetChannelResponse getChannel(long id);

  ChannelPermissionResponse upsertChannelPermission(long channelId, CreateChannelPermissionRequest request);

  List<ChannelPermissionResponse> getChannelPermissions(long channelId);

  ChannelPermissionResponse getChannelPermission(long channelId, long roleId);

  void deleteChannel(long channelId);

  GetChannelResponse renameChannel(long channelId, RenameChannelRequest request);
}
