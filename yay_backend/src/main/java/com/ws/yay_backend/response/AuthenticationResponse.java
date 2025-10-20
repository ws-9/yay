package com.ws.yay_backend.response;

import jakarta.validation.constraints.NotNull;

public class AuthenticationResponse {
  @NotNull
  private final String jwtToken;

  public AuthenticationResponse(String jwtToken) {
    this.jwtToken = jwtToken;
  }

  public String getJwtToken() {
    return jwtToken;
  }
}