package com.ws.yay_backend.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public class RegisterRequest {
  @NotNull(message = "Username required")
  @NotBlank(message = "Username cannot be whitespace")
  @Size(min = 3, max = 32, message = "Username must be between {min} and {max} characters")
  private String username;

  @NotNull(message = "Password required")
  @NotBlank(message = "Password cannot be whitespace")
  @Size(min = 8, max = 255, message = "Password must be between {min} and {max} characters")
  private String password;

  public RegisterRequest(String username, String password) {
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
