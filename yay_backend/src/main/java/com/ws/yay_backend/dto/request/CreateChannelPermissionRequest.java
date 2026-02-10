package com.ws.yay_backend.dto.request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public record CreateChannelPermissionRequest(
    @NotNull(message = "roleId required") long roleId,
    Boolean canRead,
    Boolean canWrite
) {
}
