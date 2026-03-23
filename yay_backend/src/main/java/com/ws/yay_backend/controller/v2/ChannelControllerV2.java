package com.ws.yay_backend.controller.v2;

import com.ws.yay_backend.dto.request.ChannelBatchRequestV2;
import com.ws.yay_backend.dto.request.CreateChannelRequestV2;
import com.ws.yay_backend.dto.response.ChannelResponseV2;
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
public class ChannelControllerV2 {
  private final ChannelService channelService;

  public ChannelControllerV2(ChannelService channelService) {
    this.channelService = channelService;
  }

  @Operation(summary = "Create a channel")
  @PostMapping
  @ResponseStatus(HttpStatus.CREATED)
  public ChannelResponseV2 createChannel(@RequestBody @Valid CreateChannelRequestV2 request) {
    return channelService.createChannelV2(request);
  }

  @Operation(summary = "Get channel by id")
  @GetMapping("/{id}")
  public ChannelResponseV2 getChannel(@PathVariable long id) {
    return channelService.getChannelV2(id);
  }

  @Operation(summary = "Get channels (filtered by communityIds)")
  @GetMapping
  public List<ChannelResponseV2> getChannels(@RequestParam List<Long> communityIds) {
    return channelService.getChannelsByCommunityV2(communityIds);
  }

  @Operation(summary = "Batch fetch channels")
  @PostMapping("/batch")
  public List<ChannelResponseV2> getChannelsBatch(
      @RequestBody @Valid ChannelBatchRequestV2 request) {
    return channelService.getChannelsBatchV2(request);
  }

  @Operation(summary = "Delete channel")
  @DeleteMapping("/{id}")
  @ResponseStatus(HttpStatus.NO_CONTENT)
  public void deleteChannel(@PathVariable long id) {
    channelService.deleteChannelV2(id);
  }
}
