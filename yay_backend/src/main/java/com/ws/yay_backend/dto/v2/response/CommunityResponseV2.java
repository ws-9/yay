package com.ws.yay_backend.dto.v2.response;

import com.ws.yay_backend.entity.Community;
import jakarta.validation.constraints.NotNull;

public record CommunityResponseV2(@NotNull long id, @NotNull String name, @NotNull long ownerId) {
  public static CommunityResponseV2 fromEntity(Community community) {
    return new CommunityResponseV2(
        community.getId(), community.getName(), community.getOwner().getId());
  }
}
