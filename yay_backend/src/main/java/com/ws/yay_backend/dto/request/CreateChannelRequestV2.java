package com.ws.yay_backend.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record CreateChannelRequestV2(
    @NotBlank @Size(max = 35) String name, @NotNull Long communityId) {}
