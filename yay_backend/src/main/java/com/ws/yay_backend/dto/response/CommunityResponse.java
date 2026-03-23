package com.ws.yay_backend.dto.response;

import com.ws.yay_backend.entity.Community;
import jakarta.validation.constraints.NotNull;

public record CommunityResponse(@NotNull long id, @NotNull String name, @NotNull long ownerId) {
  public static CommunityResponse fromEntity(Community community) {
    return new CommunityResponse(
        community.getId(), community.getName(), community.getOwner().getId());
  }
}
