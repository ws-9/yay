package com.ws.yay_backend.dto.request;

import jakarta.validation.constraints.NotEmpty;

public record RenameChannelRequest(
    @NotEmpty(message = "name required") String name
) {
}
