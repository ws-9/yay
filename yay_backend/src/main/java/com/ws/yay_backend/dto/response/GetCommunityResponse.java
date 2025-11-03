package com.ws.yay_backend.dto.response;

import jakarta.validation.constraints.NotNull;

public class GetCommunityResponse {
  @NotNull
  private final Long id;
  @NotNull
  private final String name;
  @NotNull
  private final Long ownerId;
  @NotNull
  private final String ownerUsername;

  public GetCommunityResponse(Long id, String name, Long ownerId, String ownerUsername) {
    this.id = id;
    this.name = name;
    this.ownerId = ownerId;
    this.ownerUsername = ownerUsername;
  }

  public Long getId() {
    return id;
  }

  public String getName() {
    return name;
  }

  public Long getOwnerId() {
    return ownerId;
  }

  public String getOwnerUsername() {
    return ownerUsername;
  }
}
