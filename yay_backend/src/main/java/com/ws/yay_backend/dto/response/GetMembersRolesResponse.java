package com.ws.yay_backend.dto.response;

import java.util.Map;

public record GetMembersRolesResponse(
    Map<Long, CommunityRoleResponse> roles
) {}
