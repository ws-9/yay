package com.ws.yay_backend.dto.request;

import jakarta.validation.constraints.NotEmpty;
import java.util.List;

public record UserBatchRequest(@NotEmpty List<Long> ids) {}
