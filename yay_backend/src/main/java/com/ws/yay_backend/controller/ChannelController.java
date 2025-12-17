package com.ws.yay_backend.controller;

import com.ws.yay_backend.dto.request.CreateChannelRequest;
import com.ws.yay_backend.dto.response.GetChannelMessageResponse;
import com.ws.yay_backend.dto.response.GetChannelResponse;
import com.ws.yay_backend.service.ChannelService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name = "Channels")
@RestController
@RequestMapping("/api/channels")
public class ChannelController {
  private final ChannelService channelService;

  @Autowired
  public ChannelController(ChannelService channelService) {
    this.channelService = channelService;
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

  @Operation(summary = "Get all channel messages")
  @GetMapping("{id}/messages")
  public List<GetChannelMessageResponse> getChannels(@PathVariable Long id) {
    return channelService.getChannelMessages(id);
  }
}
