package com.ws.yay_backend.dto.v2.response;

import com.ws.yay_backend.entity.CommunityRole;
import jakarta.validation.constraints.NotNull;

public record RoleResponseV2(
    @NotNull long id,
    @NotNull String name,
    @NotNull int hierarchyLevel,
    @NotNull boolean canManageChannels,
    @NotNull boolean canBanUsers,
    @NotNull boolean canManageRoles,
    @NotNull boolean canDeleteMessages,
    @NotNull boolean canManageCommunitySettings) {
  public static RoleResponseV2 fromEntity(CommunityRole role) {
    return new RoleResponseV2(
        role.getId(),
        role.getName(),
        role.getHierarchyLevel(),
        role.getCanManageChannels(),
        role.getCanBanUsers(),
        role.getCanManageRoles(),
        role.getCanDeleteMessages(),
        role.getCanManageCommunitySettings());
  }
}
