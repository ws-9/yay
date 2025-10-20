package com.ws.yay_backend.response;

import jakarta.validation.constraints.NotNull;

public class GetMemberResponse {
  @NotNull
  private final long id;
  @NotNull
  private final String username;

  public GetMemberResponse(long id, String username) {
    this.id = id;
    this.username = username;
  }

  public long getId() {
    return id;
  }

  public String getUsername() {
    return username;
  }
}
