package com.ws.yay_backend.controller;

import com.ws.yay_backend.dto.request.ChannelPermissionRequest;
import com.ws.yay_backend.dto.response.ChannelPermissionResponse;
import com.ws.yay_backend.service.ChannelPermissionService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@Tag(name = "Channel Permissions V2")
@RestController
@RequestMapping("/api/v2/channel-permissions")
public class ChannelPermissionController {
  private final ChannelPermissionService channelPermissionService;

  public ChannelPermissionController(ChannelPermissionService channelPermissionService) {
    this.channelPermissionService = channelPermissionService;
  }

  @Operation(summary = "Get all channel permissions (filtered by communityIds)")
  @GetMapping
  public List<ChannelPermissionResponse> getChannelPermissions(
      @RequestParam List<Long> communityIds) {
    return channelPermissionService.getChannelPermissions(communityIds);
  }

  @Operation(summary = "Get a specific channel permission")
  @GetMapping("/{channelId}/{roleId}")
  public ChannelPermissionResponse getChannelPermission(
      @PathVariable long channelId, @PathVariable long roleId) {
    return channelPermissionService.getChannelPermission(channelId, roleId);
  }

  @Operation(summary = "Upsert a channel permission")
  @PutMapping
  public ChannelPermissionResponse upsertChannelPermission(
      @RequestBody @Valid ChannelPermissionRequest request) {
    return channelPermissionService.upsertChannelPermission(request);
  }

  @Operation(summary = "Delete a channel permission (reverts to default)")
  @DeleteMapping("/{channelId}/{roleId}")
  @ResponseStatus(HttpStatus.NO_CONTENT)
  public void deleteChannelPermission(@PathVariable long channelId, @PathVariable long roleId) {
    channelPermissionService.deleteChannelPermission(channelId, roleId);
  }
}
