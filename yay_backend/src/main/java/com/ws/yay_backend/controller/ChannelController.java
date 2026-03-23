package com.ws.yay_backend.controller;

import com.ws.yay_backend.dto.request.ChannelBatchRequest;
import com.ws.yay_backend.dto.request.CreateChannelRequest;
import com.ws.yay_backend.dto.response.ChannelResponse;
import com.ws.yay_backend.service.ChannelService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@Tag(name = "Channels V2")
@RestController
@RequestMapping("/api/v2/channels")
public class ChannelController {
  private final ChannelService channelService;

  public ChannelController(ChannelService channelService) {
    this.channelService = channelService;
  }

  @Operation(summary = "Create a channel")
  @PostMapping
  @ResponseStatus(HttpStatus.CREATED)
  public ChannelResponse createChannel(@RequestBody @Valid CreateChannelRequest request) {
    return channelService.createChannel(request);
  }

  @Operation(summary = "Get channel by id")
  @GetMapping("/{id}")
  public ChannelResponse getChannel(@PathVariable long id) {
    return channelService.getChannel(id);
  }

  @Operation(summary = "Get channels (filtered by communityIds)")
  @GetMapping
  public List<ChannelResponse> getChannels(@RequestParam List<Long> communityIds) {
    return channelService.getChannelsByCommunity(communityIds);
  }

  @Operation(summary = "Batch fetch channels")
  @PostMapping("/batch")
  public List<ChannelResponse> getChannelsBatch(@RequestBody @Valid ChannelBatchRequest request) {
    return channelService.getChannelsBatch(request);
  }

  @Operation(summary = "Delete channel")
  @DeleteMapping("/{id}")
  @ResponseStatus(HttpStatus.NO_CONTENT)
  public void deleteChannel(@PathVariable long id) {
    channelService.deleteChannel(id);
  }
}
