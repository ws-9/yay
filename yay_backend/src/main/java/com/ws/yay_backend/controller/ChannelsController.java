package com.ws.yay_backend.controller;

import com.ws.yay_backend.request.CreateChannelRequest;
import com.ws.yay_backend.response.GetChannelResponse;
import com.ws.yay_backend.service.ChannelService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@Tag(name = "Channels")
@RestController
@RequestMapping("/api/channels")
public class ChannelsController {
  private final ChannelService channelService;

  @Autowired
  public ChannelsController(ChannelService channelService) {
    this.channelService = channelService;
  }

  @Operation(summary = "Create a channel")
  @PostMapping
  @ResponseStatus(HttpStatus.CREATED)
  public GetChannelResponse createChannel(@RequestBody @Valid CreateChannelRequest request) {
    return channelService.createChannel(request);
  }
}
