package com.ws.yay_backend.controller;

import com.ws.yay_backend.request.CreateCommunityRequest;
import com.ws.yay_backend.response.GetChannelResponse;
import com.ws.yay_backend.response.GetCommunityResponse;
import com.ws.yay_backend.response.GetMemberResponse;
import com.ws.yay_backend.response.JoinCommunityResponse;
import com.ws.yay_backend.service.CommunityService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/communities")
public class CommunityController {
  private final CommunityService communityService;

  @Autowired
  public CommunityController(CommunityService communityService) {
    this.communityService = communityService;
  }

  @Tag(name = "Communities")
  @Operation(summary = "Get all existing communities")
  @GetMapping
  public List<GetCommunityResponse> getAllCommunities() {
    return communityService.getAll();
  }

  @Tag(name = "Communities")
  @Operation(summary = "Create a community")
  @PostMapping
  @ResponseStatus(HttpStatus.CREATED)
  public GetCommunityResponse createCommunity(@RequestBody @Valid CreateCommunityRequest request) {
    return communityService.createCommunity(request);
  }

  @Tag(name = "Communities")
  @Operation(summary = "Get community by id")
  @GetMapping("/{id}")
  public GetCommunityResponse getCommunity(@PathVariable @Min(value = 1) long id) {
    return communityService.getCommunity(id);
  }

  @Tag(name = "Communities")
  @Operation(summary = "Delete community by id")
  @DeleteMapping("/{id}")
  @ResponseStatus(HttpStatus.NO_CONTENT)
  public void deleteCommunity(@PathVariable @Min(value = 1) Long id) {
    communityService.deleteCommunity(id);
  }

  @Tag(name = "Members")
  @Operation(summary = "Get all community members by id")
  @GetMapping("{id}/members")
  public List<GetMemberResponse> getAllMembers(@PathVariable @Min(value = 1) Long id) {
    return communityService.getAllMembers(id);
  }

  @Tag(name = "Members")
  @Operation(summary = "Add user to community")
  @PostMapping("{id}/members")
  @ResponseStatus(HttpStatus.CREATED)
  public JoinCommunityResponse joinCommunity(@PathVariable @Min(value = 1) Long id) {
    return communityService.joinCommunity(id);
  }

  @Tag(name = "Members")
  @Operation(summary = "Remove user from a community")
  @DeleteMapping("{id}/members/{userId}")
  @ResponseStatus(HttpStatus.NO_CONTENT)
  public void removeMember(@PathVariable @Min(value = 1) Long id, @PathVariable @Min(value = 1) Long userId) {
    communityService.deleteMember(id, userId);
  }

  @Tag(name = "Communities")
  @Operation(summary = "Get user's own communities")
  @GetMapping("/my-communities")
  public List<GetCommunityResponse> getMyCommunities() {
    return communityService.getUserOwnCommunities();
  }

  @Tag(name = "Communities")
  @Operation(summary = "Get all community channels")
  @GetMapping("{id}/channels")
  public List<GetChannelResponse> getChannels(@PathVariable @Min(value = 1) Long id) {
    return communityService.getCommunityChannels(id);
  }
}
