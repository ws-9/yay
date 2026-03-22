package com.ws.yay_backend.dto.v1.request;

import jakarta.validation.constraints.NotEmpty;

public record RenameChannelRequest(@NotEmpty(message = "name required") String name) {}
