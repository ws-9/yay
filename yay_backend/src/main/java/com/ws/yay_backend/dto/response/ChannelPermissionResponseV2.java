package com.ws.yay_backend.dto.response;

import com.ws.yay_backend.entity.ChannelPermission;
import jakarta.validation.constraints.NotNull;

public record ChannelPermissionResponseV2(
    @NotNull long channelId,
    @NotNull long roleId,
    @NotNull boolean canRead,
    @NotNull boolean canWrite) {
  public static ChannelPermissionResponseV2 fromEntity(ChannelPermission entity) {
    return new ChannelPermissionResponseV2(
        entity.getKey().getChannelId(),
        entity.getKey().getRoleId(),
        entity.getCanRead(),
        entity.getCanWrite());
  }
}
