package com.ws.yay_backend.dto.response;

import com.ws.yay_backend.entity.CommunityRole;
import jakarta.validation.constraints.NotNull;

public record RoleResponse(
    @NotNull long id,
    @NotNull String name,
    @NotNull int hierarchyLevel,
    @NotNull boolean canManageChannels,
    @NotNull boolean canBanUsers,
    @NotNull boolean canManageRoles,
    @NotNull boolean canDeleteMessages,
    @NotNull boolean canManageCommunitySettings) {
  public static RoleResponse fromEntity(CommunityRole role) {
    return new RoleResponse(
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
