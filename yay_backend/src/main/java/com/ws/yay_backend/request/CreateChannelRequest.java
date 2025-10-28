package com.ws.yay_backend.request;

import jakarta.validation.constraints.NotEmpty;

public record CreateChannelRequest(
    @NotEmpty(message = "name required") String name
) {
}
