package com.ws.yay_backend.dto.response;

import com.ws.yay_backend.entity.ChannelMessage;
import jakarta.annotation.Nullable;
import jakarta.validation.constraints.NotNull;

import java.time.Instant;

public record GetChannelMessageResponse(
    @NotNull long id,
    @NotNull String message,
    @NotNull long userId,
    @NotNull String username,
    @NotNull long channelId,
    @NotNull Instant createdAt,
    @Nullable Instant updatedAt,
    @Nullable Instant deletedAt
) {
  public GetChannelMessageResponse(ChannelMessage message) {
    this(
        message.getId(),
        message.getMessage(),
        message.getUser().getId(),
        message.getUser().getUsername(),
        message.getChannel().getId(),
        message.getCreatedAt(),
        message.getUpdatedAt(),
        message.getDeletedAt()
    );
  }
}
