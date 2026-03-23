package com.ws.yay_backend.dto.request;

import jakarta.validation.constraints.NotNull;

public record ChannelPermissionRequestV2(
    @NotNull Long channelId,
    @NotNull Long roleId,
    @NotNull Boolean canRead,
    @NotNull Boolean canWrite) {}
