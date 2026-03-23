package com.ws.yay_backend.dto.response;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record InviteResponseV2(@NotNull long communityId, @NotBlank String inviteSlug) {}
