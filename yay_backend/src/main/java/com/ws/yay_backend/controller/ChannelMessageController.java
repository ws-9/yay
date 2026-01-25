package com.ws.yay_backend.controller;

import com.ws.yay_backend.dto.request.CreateChannelMessageRequest;
import com.ws.yay_backend.dto.request.DeleteChannelMessageRequest;
import com.ws.yay_backend.dto.request.EditChannelMessageRequest;
import com.ws.yay_backend.dto.response.GetChannelMessageResponse;
import com.ws.yay_backend.service.ChannelMessageService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@Tag(name = "Channel Messages")
@RestController
@RequestMapping("/api/messages")
public class ChannelMessageController {
  private final ChannelMessageService channelMessageService;

  @Autowired
  public ChannelMessageController(ChannelMessageService channelMessageService) {
    this.channelMessageService = channelMessageService;
  }

  @Operation(summary = "Create a channel message")
  @PostMapping
  @ResponseStatus(HttpStatus.CREATED)
  public GetChannelMessageResponse createChannelMessage(@RequestBody @Valid CreateChannelMessageRequest request) {
    return channelMessageService.createMessage(request);
  }

  @Operation(summary = "Edit a channel message")
  @PutMapping
  @ResponseStatus(HttpStatus.OK)
  public GetChannelMessageResponse editChannelMessage(@RequestBody @Valid EditChannelMessageRequest request) {
    return channelMessageService.editMessage(request);
  }

  @Operation(summary = "Delete a channel message")
  @DeleteMapping
  @ResponseStatus(HttpStatus.NO_CONTENT)
  public void deleteChannelMessage(@RequestBody @Valid DeleteChannelMessageRequest request) {
    channelMessageService.deleteMessage(request);
  }
}
