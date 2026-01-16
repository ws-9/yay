package com.ws.yay_backend.controller;

import com.ws.yay_backend.dto.request.JoinCommunityRequest;
import com.ws.yay_backend.dto.request.RemoveMemberRequest;
import com.ws.yay_backend.dto.response.JoinCommunityResponse;
import com.ws.yay_backend.service.MemberService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Tag(name = "Members")
@RestController
@RequestMapping("/api/members")
public class MemberController {
  private final MemberService memberService;

  @Autowired
  public MemberController(MemberService memberService) {
    this.memberService = memberService;
  }

  @Operation(summary = "Add user to community")
  @PostMapping
  public ResponseEntity<JoinCommunityResponse> joinCommunity(@RequestBody @Valid JoinCommunityRequest request) {
    JoinCommunityResponse result = memberService.joinCommunity(request);
    HttpStatus status = result.isNewMember() ? HttpStatus.CREATED : HttpStatus.OK;
    return ResponseEntity.status(status).body(result);
  }

  @Operation(summary = "Remove user from a community")
  @DeleteMapping
  @ResponseStatus(HttpStatus.NO_CONTENT)
  public void removeMember(@RequestBody @Valid RemoveMemberRequest request) {
    memberService.deleteMember(request);
  }
}
