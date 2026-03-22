package com.ws.yay_backend.dto.v1.response;

import jakarta.validation.constraints.NotNull;

public record JoinCommunityResponse(
    @NotNull long memberId, @NotNull String memberUsername, @NotNull boolean isNewMember) {}
