package com.ws.yay_backend.dto.v2.request;

import jakarta.validation.constraints.NotEmpty;
import java.util.List;

public record UserBatchRequestV2(@NotEmpty List<Long> ids) {}
