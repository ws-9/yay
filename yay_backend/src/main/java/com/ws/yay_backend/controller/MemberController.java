package com.ws.yay_backend.controller;

import com.ws.yay_backend.dto.request.JoinCommunityRequest;
import com.ws.yay_backend.dto.request.UpdateMemberRoleRequest;
import com.ws.yay_backend.dto.response.MemberResponse;
import com.ws.yay_backend.service.MemberService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@Tag(name = "Members V2")
@RestController
@RequestMapping("/api/v2/members")
public class MemberController {
  private final MemberService memberService;

  public MemberController(MemberService memberService) {
    this.memberService = memberService;
  }

  @Operation(summary = "Join a community")
  @PostMapping
  @ResponseStatus(HttpStatus.CREATED)
  public MemberResponse joinCommunity(@RequestBody @Valid JoinCommunityRequest request) {
    return memberService.joinCommunity(request);
  }

  @Operation(summary = "Get members (filtered by communityId and optionally userId)")
  @GetMapping
  public List<MemberResponse> getMembers(
      @RequestParam long communityId, @RequestParam(required = false) Long userId) {
    if (userId != null) {
      return List.of(memberService.getMember(communityId, userId));
    }
    return memberService.getMembersByCommunity(communityId);
  }

  @Operation(summary = "Update member role")
  @PatchMapping("/{communityId}/{userId}")
  public MemberResponse updateMemberRole(
      @PathVariable long communityId,
      @PathVariable long userId,
      @RequestBody @Valid UpdateMemberRoleRequest request) {
    return memberService.updateMemberRole(communityId, userId, request);
  }

  @Operation(summary = "Remove member from community")
  @DeleteMapping("/{communityId}/{userId}")
  @ResponseStatus(HttpStatus.NO_CONTENT)
  public void removeMember(@PathVariable long communityId, @PathVariable long userId) {
    memberService.deleteMember(communityId, userId);
  }
}
