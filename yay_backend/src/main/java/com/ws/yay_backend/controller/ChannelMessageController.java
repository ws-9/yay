package com.ws.yay_backend.controller;

import com.ws.yay_backend.request.CreateChannelMessageRequest;
import com.ws.yay_backend.response.GetChannelMessageResponse;
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
}
