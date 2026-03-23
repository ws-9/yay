package com.ws.yay_backend.dto.request;

import jakarta.validation.constraints.NotNull;

public record UpdateMemberRoleRequestV2(@NotNull Long roleId) {}
