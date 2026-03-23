package com.ws.yay_backend.dto.response;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record InviteResponse(@NotNull long communityId, @NotBlank String inviteSlug) {}
