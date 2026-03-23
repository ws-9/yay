package com.ws.yay_backend.dto.response;

import com.ws.yay_backend.entity.User;
import jakarta.validation.constraints.NotNull;

public record UserResponse(@NotNull long id, @NotNull String username) {
  public static UserResponse fromEntity(User user) {
    return new UserResponse(user.getId(), user.getUsername());
  }
}
