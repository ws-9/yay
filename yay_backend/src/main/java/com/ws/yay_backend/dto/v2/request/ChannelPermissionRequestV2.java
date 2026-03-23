package com.ws.yay_backend.dto.v2.request;

import jakarta.validation.constraints.NotNull;

public record ChannelPermissionRequestV2(
    @NotNull Long channelId,
    @NotNull Long roleId,
    @NotNull Boolean canRead,
    @NotNull Boolean canWrite) {}
