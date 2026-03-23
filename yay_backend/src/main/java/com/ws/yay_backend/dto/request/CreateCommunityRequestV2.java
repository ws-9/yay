package com.ws.yay_backend.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record CreateCommunityRequestV2(@NotBlank @Size(max = 50) String name) {}
