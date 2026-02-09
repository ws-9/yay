package com.ws.yay_backend.dto.request;

import jakarta.validation.constraints.NotBlank;

public record JoinCommunityRequest(
    @NotBlank(message = "inviteSlug required") String inviteSlug
) {
}
