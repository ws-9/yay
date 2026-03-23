package com.ws.yay_backend.controller.v2;

import com.ws.yay_backend.dto.v2.request.JoinCommunityRequestV2;
import com.ws.yay_backend.dto.v2.request.UpdateMemberRoleRequestV2;
import com.ws.yay_backend.dto.v2.response.MemberResponseV2;
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
public class MemberControllerV2 {
  private final MemberService memberService;

  public MemberControllerV2(MemberService memberService) {
    this.memberService = memberService;
  }

  @Operation(summary = "Join a community")
  @PostMapping
  @ResponseStatus(HttpStatus.CREATED)
  public MemberResponseV2 joinCommunity(@RequestBody @Valid JoinCommunityRequestV2 request) {
    return memberService.joinCommunityV2(request);
  }

  @Operation(summary = "Get members (filtered by communityId and optionally userId)")
  @GetMapping
  public List<MemberResponseV2> getMembers(
      @RequestParam long communityId, @RequestParam(required = false) Long userId) {
    if (userId != null) {
      return List.of(memberService.getMemberV2(communityId, userId));
    }
    return memberService.getMembersByCommunityV2(communityId);
  }

  @Operation(summary = "Update member role")
  @PatchMapping("/{communityId}/{userId}")
  public MemberResponseV2 updateMemberRole(
      @PathVariable long communityId,
      @PathVariable long userId,
      @RequestBody @Valid UpdateMemberRoleRequestV2 request) {
    return memberService.updateMemberRoleV2(communityId, userId, request);
  }

  @Operation(summary = "Remove member from community")
  @DeleteMapping("/{communityId}/{userId}")
  @ResponseStatus(HttpStatus.NO_CONTENT)
  public void removeMember(@PathVariable long communityId, @PathVariable long userId) {
    memberService.deleteMemberV2(communityId, userId);
  }
}
