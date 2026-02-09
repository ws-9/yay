package com.ws.yay_backend.controller;

import com.ws.yay_backend.dto.request.CreateCommunityRequest;
import com.ws.yay_backend.dto.request.GetMemberRolesRequest;
import com.ws.yay_backend.dto.response.*;
import com.ws.yay_backend.service.CommunityService;
import com.ws.yay_backend.service.MemberService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name = "Communities")
@RestController
@RequestMapping("/api/communities")
public class CommunityController {
  private final CommunityService communityService;
  private final MemberService memberService;

  @Autowired
  public CommunityController(CommunityService communityService, MemberService memberService) {
    this.communityService = communityService;
    this.memberService = memberService;
  }

  @Operation(summary = "Get all existing communities")
  @GetMapping
  public List<GetCommunityResponse> getAllCommunities() {
    return communityService.getAll();
  }

  @Operation(summary = "Create a community")
  @PostMapping
  @ResponseStatus(HttpStatus.CREATED)
  public GetCommunityResponse createCommunity(@RequestBody @Valid CreateCommunityRequest request) {
    return communityService.createCommunity(request);
  }

  @Operation(summary = "Get community by id")
  @GetMapping("/{id}")
  public GetCommunityResponse getCommunity(@PathVariable @Min(value = 1) long id) {
    return communityService.getCommunity(id);
  }

  @Operation(summary = "Delete community by id")
  @DeleteMapping("/{id}")
  @ResponseStatus(HttpStatus.NO_CONTENT)
  public void deleteCommunity(@PathVariable @Min(value = 1) Long id) {
    communityService.deleteCommunity(id);
  }

  @Operation(summary = "Get all community members by id")
  @GetMapping("{id}/members")
  public List<GetMemberResponse> getAllMembers(@PathVariable @Min(value = 1) Long id) {
    return communityService.getAllMembers(id);
  }

  @Operation(summary = "Get user's own communities")
  @GetMapping("/my-communities")
  public List<GetCommunityResponse> getMyCommunities() {
    return communityService.getUserOwnCommunities();
  }

  @Operation(summary = "Get all community channels")
  @GetMapping("{id}/channels")
  public List<GetChannelResponse> getChannels(@PathVariable @Min(value = 1) Long id) {
    return communityService.getCommunityChannels(id);
  }

  @Operation(summary = "Get community invite")
  @GetMapping("/{id}/invites")
  public GetCommunityInviteResponse getCommunityInvite(@PathVariable @Min(value = 1) long id) {
    return communityService.getCommunityInvite(id);
  }

  @Operation(summary = "Get member roles for a community")
  @PostMapping("/{id}/members/roles")
  public GetMembersRolesResponse getMembersRoles(
      @PathVariable Long id,
      @RequestBody @Valid GetMemberRolesRequest request
  ) {
    return memberService.getRolesByUserIds(id, request.userIds());
  }
}
