package com.ws.yay_backend.dto.request;

import jakarta.validation.constraints.NotBlank;

public record JoinCommunityRequestV2(@NotBlank String inviteSlug) {}
