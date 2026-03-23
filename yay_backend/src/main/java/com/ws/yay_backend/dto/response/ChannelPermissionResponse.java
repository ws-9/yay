package com.ws.yay_backend.dto.response;

import com.ws.yay_backend.entity.ChannelPermission;
import jakarta.validation.constraints.NotNull;

public record ChannelPermissionResponse(
    @NotNull long channelId,
    @NotNull long roleId,
    @NotNull boolean canRead,
    @NotNull boolean canWrite) {
  public static ChannelPermissionResponse fromEntity(ChannelPermission entity) {
    return new ChannelPermissionResponse(
        entity.getKey().getChannelId(),
        entity.getKey().getRoleId(),
        entity.getCanRead(),
        entity.getCanWrite());
  }
}
