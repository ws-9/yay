package com.ws.yay_backend.request;

import jakarta.validation.constraints.NotEmpty;

public class AuthenticationRequest {
  @NotEmpty(message = "Username required")
  private String username;

  @NotEmpty(message = "Password required")
  private String password;

  public AuthenticationRequest(String username, String password) {
    this.username = username;
    this.password = password;
  }

  public String getUsername() {
    return username;
  }

  public void setUsername(String username) {
    this.username = username;
  }

  public String getPassword() {
    return password;
  }

  public void setPassword(String password) {
    this.password = password;
  }
}
