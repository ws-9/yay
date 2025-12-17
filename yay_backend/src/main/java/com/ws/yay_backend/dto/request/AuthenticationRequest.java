package com.ws.yay_backend.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record AuthenticationRequest(
    @NotNull(message = "Username required")
    @NotBlank(message = "Username cannot be whitespace")
    @Size(min = 3, max = 32, message = "Username must be between {min} and {max} characters")
    String username,

    @NotNull(message = "Password required")
    @NotBlank(message = "Password cannot be whitespace")
    @Size(min = 8, max = 50, message = "Password must be between {min} and {max} characters")
    String password
) {
}
