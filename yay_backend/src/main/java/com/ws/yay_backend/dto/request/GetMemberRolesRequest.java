package com.ws.yay_backend.dto.request;

import jakarta.validation.constraints.NotEmpty;

import java.util.List;

public record GetMemberRolesRequest(
    @NotEmpty(message = "User IDs cannot be empty")
    List<Long> userIds
) {}
