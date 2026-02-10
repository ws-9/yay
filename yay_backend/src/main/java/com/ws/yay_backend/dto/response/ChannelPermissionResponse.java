package com.ws.yay_backend.dto.response;

import com.ws.yay_backend.entity.ChannelPermission;

public record ChannelPermissionResponse(
    long channelId,
    long roleId,
    boolean canRead,
    boolean canWrite
) {
  public static ChannelPermissionResponse fromEntity(ChannelPermission entity) {
    return new ChannelPermissionResponse(
        entity.getKey().getChannelId(),
        entity.getKey().getRoleId(),
        entity.getCanRead(),
        entity.getCanWrite()
    );
  }
}
