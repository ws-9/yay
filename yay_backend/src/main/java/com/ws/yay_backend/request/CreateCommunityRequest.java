package com.ws.yay_backend.request;

import jakarta.validation.constraints.NotEmpty;

public class CreateCommunityRequest {
  @NotEmpty(message = "name required")
  public final String name;

  public CreateCommunityRequest(String name) {
    this.name = name;
  }

  public String getName() {
    return name;
  }
}
