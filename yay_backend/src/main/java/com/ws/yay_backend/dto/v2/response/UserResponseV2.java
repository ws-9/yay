package com.ws.yay_backend.dto.v2.response;

import com.ws.yay_backend.entity.User;
import jakarta.validation.constraints.NotNull;

public record UserResponseV2(@NotNull long id, @NotNull String username) {
  public static UserResponseV2 fromEntity(User user) {
    return new UserResponseV2(user.getId(), user.getUsername());
  }
}
