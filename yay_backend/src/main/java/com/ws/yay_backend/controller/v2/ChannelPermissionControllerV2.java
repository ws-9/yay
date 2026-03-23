package com.ws.yay_backend.controller.v2;

import com.ws.yay_backend.dto.request.ChannelPermissionRequestV2;
import com.ws.yay_backend.dto.response.ChannelPermissionResponseV2;
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
public class ChannelPermissionControllerV2 {
  private final ChannelPermissionService channelPermissionService;

  public ChannelPermissionControllerV2(ChannelPermissionService channelPermissionService) {
    this.channelPermissionService = channelPermissionService;
  }

  @Operation(summary = "Get all channel permissions (filtered by communityIds)")
  @GetMapping
  public List<ChannelPermissionResponseV2> getChannelPermissions(
      @RequestParam List<Long> communityIds) {
    return channelPermissionService.getChannelPermissionsV2(communityIds);
  }

  @Operation(summary = "Get a specific channel permission")
  @GetMapping("/{channelId}/{roleId}")
  public ChannelPermissionResponseV2 getChannelPermission(
      @PathVariable long channelId, @PathVariable long roleId) {
    return channelPermissionService.getChannelPermissionV2(channelId, roleId);
  }

  @Operation(summary = "Upsert a channel permission")
  @PutMapping
  public ChannelPermissionResponseV2 upsertChannelPermission(
      @RequestBody @Valid ChannelPermissionRequestV2 request) {
    return channelPermissionService.upsertChannelPermissionV2(request);
  }

  @Operation(summary = "Delete a channel permission (reverts to default)")
  @DeleteMapping("/{channelId}/{roleId}")
  @ResponseStatus(HttpStatus.NO_CONTENT)
  public void deleteChannelPermission(@PathVariable long channelId, @PathVariable long roleId) {
    channelPermissionService.deleteChannelPermissionV2(channelId, roleId);
  }
}
