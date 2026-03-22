package com.ws.yay_backend.dto.v1.response;

import java.util.Map;

public record GetMembersRolesResponse(Map<Long, CommunityRoleResponse> roles) {}
