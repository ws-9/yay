package com.ws.yay_backend.dto.v1.response;

public record BannedUserResponse(
    Long userId, String username, Long communityId, String communityName) {}
