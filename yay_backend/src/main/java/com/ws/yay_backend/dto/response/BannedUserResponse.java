package com.ws.yay_backend.dto.response;

public record BannedUserResponse(
    Long userId,
    String username,
    Long communityId,
    String communityName
) {}