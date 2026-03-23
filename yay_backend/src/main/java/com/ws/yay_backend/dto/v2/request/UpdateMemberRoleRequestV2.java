package com.ws.yay_backend.dto.v2.request;

import jakarta.validation.constraints.NotNull;

public record UpdateMemberRoleRequestV2(@NotNull Long roleId) {}
