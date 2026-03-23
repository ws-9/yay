package com.ws.yay_backend.controller.v2;

import com.ws.yay_backend.dto.v1.response.CursorPaginatedResponse;
import com.ws.yay_backend.dto.v2.request.CreateMessageRequestV2;
import com.ws.yay_backend.dto.v2.request.UpdateMessageRequestV2;
import com.ws.yay_backend.dto.v2.response.MessageResponseV2;
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
public class ChannelMessageControllerV2 {
  private final ChannelMessageService channelMessageService;

  public ChannelMessageControllerV2(ChannelMessageService channelMessageService) {
    this.channelMessageService = channelMessageService;
  }

  @Operation(summary = "Create a channel message")
  @PostMapping
  @ResponseStatus(HttpStatus.CREATED)
  public MessageResponseV2 createMessage(@RequestBody @Valid CreateMessageRequestV2 request) {
    return channelMessageService.createMessageV2(request);
  }

  @Operation(summary = "Get message by id")
  @GetMapping("/{id}")
  public MessageResponseV2 getMessage(@PathVariable long id) {
    return channelMessageService.getMessageV2(id);
  }

  @Operation(summary = "Update a message")
  @PatchMapping("/{id}")
  public MessageResponseV2 updateMessage(
      @PathVariable long id, @RequestBody @Valid UpdateMessageRequestV2 request) {
    return channelMessageService.updateMessageV2(id, request);
  }

  @Operation(summary = "Delete a message")
  @DeleteMapping("/{id}")
  @ResponseStatus(HttpStatus.NO_CONTENT)
  public void deleteMessage(@PathVariable long id) {
    channelMessageService.deleteMessageV2(id);
  }

  @Operation(summary = "Get paginated channel messages")
  @GetMapping
  public CursorPaginatedResponse<MessageResponseV2> getMessages(
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
    return channelMessageService.getCursorPaginatedMessagesV2(channelId, size, cursor, cursorId);
  }
}
