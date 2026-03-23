package com.ws.yay_backend.controller;

import com.ws.yay_backend.dto.response.InviteResponse;
import com.ws.yay_backend.service.InviteService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.constraints.Min;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v2/invites")
@Tag(name = "Invite V2", description = "Flat Community Invite API")
@Validated
public class InviteController {

  private final InviteService inviteService;

  public InviteController(InviteService inviteService) {
    this.inviteService = inviteService;
  }

  @Operation(summary = "Get community invite by community ID")
  @GetMapping
  public InviteResponse getInvite(@RequestParam @Min(1) long communityId) {
    return inviteService.getInvite(communityId);
  }
}
