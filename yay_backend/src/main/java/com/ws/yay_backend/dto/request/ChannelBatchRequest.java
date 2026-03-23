package com.ws.yay_backend.dto.request;

import jakarta.validation.constraints.NotEmpty;
import java.util.List;

public record ChannelBatchRequest(@NotEmpty List<Long> ids) {}
