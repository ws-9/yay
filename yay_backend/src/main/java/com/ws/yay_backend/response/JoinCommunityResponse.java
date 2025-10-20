package com.ws.yay_backend.response;

import jakarta.validation.constraints.NotNull;

public record JoinCommunityResponse(
    @NotNull long memberId,
    @NotNull String memberUsername
) { }
