package com.ws.yay_backend.dto.response;

import com.ws.yay_backend.entity.CommunityRole;
import jakarta.validation.constraints.NotNull;

public record CommunityRoleResponse(
    @NotNull Long id,
    @NotNull String name,
    @NotNull Integer hierarchyLevel,
    @NotNull Boolean canManageChannels,
    @NotNull Boolean canBanUsers,
    @NotNull Boolean canManageRoles,
    @NotNull Boolean canDeleteMessages,
    @NotNull Boolean canManageCommunitySettings
) {
  public static CommunityRoleResponse fromEntity(CommunityRole role) {
    return new CommunityRoleResponse(
        role.getId(),
        role.getName(),
        role.getHierarchyLevel(),
        role.getCanManageChannels(),
        role.getCanBanUsers(),
        role.getCanManageRoles(),
        role.getCanDeleteMessages(),
        role.getCanManageCommunitySettings()
    );
  }
}
