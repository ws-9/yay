package com.ws.yay_backend.controller;

import com.ws.yay_backend.dto.request.CreateChannelRequest;
import com.ws.yay_backend.dto.response.CursorPaginatedResponse;
import com.ws.yay_backend.dto.response.GetChannelMessageResponse;
import com.ws.yay_backend.dto.response.GetChannelResponse;
import com.ws.yay_backend.service.ChannelMessageService;
import com.ws.yay_backend.service.ChannelService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;

@Tag(name = "Channels")
@RestController
@RequestMapping("/api/channels")
public class ChannelController {
  private final ChannelService channelService;
  private final ChannelMessageService channelMessageService;

  @Autowired
  public ChannelController(ChannelService channelService, ChannelMessageService channelMessageService) {
    this.channelService = channelService;
    this.channelMessageService = channelMessageService;
  }

  @Operation(summary = "Create a channel")
  @PostMapping
  @ResponseStatus(HttpStatus.CREATED)
  public GetChannelResponse createChannel(@RequestBody @Valid CreateChannelRequest request) {
    return channelService.createChannel(request);
  }

  @Operation(summary = "Get channel by id")
  @GetMapping("{id}")
  public GetChannelResponse getChannel(@PathVariable long id) {
    return channelService.getChannel(id);
  }

  @Operation(summary = "Get paginated channel messages")
  @GetMapping("{id}/messages")
  public CursorPaginatedResponse<GetChannelMessageResponse> getChannelMessages(
      @PathVariable
      long id,
      @RequestParam(defaultValue = "50") @Min(1) @Max(100)
      int size,
      @Parameter(
          description = "Cursor timestamp (ISO-8601 UTC)",
          example = "2025-03-21T14:32:05.123Z"
      )
      @RequestParam(required = false)
      Instant cursor,
      @Parameter(
          description = "Cursor message ID for keyset pagination",
          example = "42"
      )
      @RequestParam(required = false)
      Long cursorId
  ) {
    return channelMessageService.getCursorPaginatedMessages(id, size, cursor, cursorId);
  }
}
