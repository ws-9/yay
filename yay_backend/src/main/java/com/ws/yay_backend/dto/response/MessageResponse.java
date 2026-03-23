package com.ws.yay_backend.dto.response;

import com.ws.yay_backend.entity.ChannelMessage;
import jakarta.annotation.Nullable;
import jakarta.validation.constraints.NotNull;
import java.time.Instant;

public record MessageResponse(
    @NotNull long id,
    @NotNull String message,
    @NotNull long userId,
    @NotNull long channelId,
    @NotNull Instant createdAt,
    @Nullable Instant updatedAt,
    @Nullable Instant deletedAt) {
  public static MessageResponse fromEntity(ChannelMessage message) {
    return new MessageResponse(
        message.getId(),
        message.getMessage(),
        message.getUser().getId(),
        message.getChannel().getId(),
        message.getCreatedAt(),
        message.getUpdatedAt(),
        message.getDeletedAt());
  }
}
