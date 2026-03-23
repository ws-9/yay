package com.ws.yay_backend.controller;

import com.ws.yay_backend.dto.request.CreateMessageRequest;
import com.ws.yay_backend.dto.request.UpdateMessageRequest;
import com.ws.yay_backend.dto.response.CursorPaginatedResponse;
import com.ws.yay_backend.dto.response.MessageResponse;
import com.ws.yay_backend.service.ChannelMessageService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import java.time.Instant;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@Tag(name = "Channel Messages V2")
@RestController
@RequestMapping("/api/v2/messages")
public class ChannelMessageController {
  private final ChannelMessageService channelMessageService;

  public ChannelMessageController(ChannelMessageService channelMessageService) {
    this.channelMessageService = channelMessageService;
  }

  @Operation(summary = "Create a channel message")
  @PostMapping
  @ResponseStatus(HttpStatus.CREATED)
  public MessageResponse createMessage(@RequestBody @Valid CreateMessageRequest request) {
    return channelMessageService.createMessage(request);
  }

  @Operation(summary = "Get message by id")
  @GetMapping("/{id}")
  public MessageResponse getMessage(@PathVariable long id) {
    return channelMessageService.getMessage(id);
  }

  @Operation(summary = "Update a message")
  @PatchMapping("/{id}")
  public MessageResponse updateMessage(
      @PathVariable long id, @RequestBody @Valid UpdateMessageRequest request) {
    return channelMessageService.updateMessage(id, request);
  }

  @Operation(summary = "Delete a message")
  @DeleteMapping("/{id}")
  @ResponseStatus(HttpStatus.NO_CONTENT)
  public void deleteMessage(@PathVariable long id) {
    channelMessageService.deleteMessage(id);
  }

  @Operation(summary = "Get paginated channel messages")
  @GetMapping
  public CursorPaginatedResponse<MessageResponse> getMessages(
      @RequestParam long channelId,
      @RequestParam(defaultValue = "50") @Min(1) @Max(100) int size,
      @Parameter(
              description = "Cursor timestamp (ISO-8601 UTC)",
              example = "2025-03-21T14:32:05.123Z")
          @RequestParam(required = false)
          Instant cursor,
      @Parameter(description = "Cursor message ID for keyset pagination", example = "42")
          @RequestParam(required = false)
          Long cursorId) {
    return channelMessageService.getCursorPaginatedMessages(channelId, size, cursor, cursorId);
  }
}
