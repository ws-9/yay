package com.ws.yay_backend.controller;

import com.ws.yay_backend.request.CreateCommunityRequest;
import com.ws.yay_backend.response.GetCommunityResponse;
import com.ws.yay_backend.response.GetMemberResponse;
import com.ws.yay_backend.response.JoinCommunityResponse;
import com.ws.yay_backend.service.CommunityService;
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

  @GetMapping
  public List<GetCommunityResponse> getAllCommunities() {
    return communityService.getAll();
  }

  @PostMapping
  @ResponseStatus(HttpStatus.CREATED)
  public GetCommunityResponse createCommunity(@RequestBody @Valid CreateCommunityRequest request) {
    return communityService.createCommunity(request);
  }

  @GetMapping("/{id}")
  public GetCommunityResponse getCommunity(@PathVariable @Min(value = 1) long id) {
    return communityService.getCommunity(id);
  }

  @DeleteMapping("/{id}")
  @ResponseStatus(HttpStatus.NO_CONTENT)
  public void deleteCommunity(@PathVariable @Min(value = 1) Long id) {
    communityService.deleteCommunity(id);
  }

  @GetMapping("{id}/members")
  public List<GetMemberResponse> getAllMembers(@PathVariable @Min(value = 1) Long id) {
    return communityService.getAllMembers(id);
  }

  @PostMapping("{id}/members")
  @ResponseStatus(HttpStatus.CREATED)
  public JoinCommunityResponse joinCommunity(@PathVariable @Min(value = 1) Long id) {
    return communityService.joinCommunity(id);
  }

  @DeleteMapping("{id}/members/{userId}")
  @ResponseStatus(HttpStatus.NO_CONTENT)
  public void removeMember(@PathVariable @Min(value = 1) Long id, @PathVariable @Min(value = 1) Long userId) {
    communityService.deleteMember(id, userId);
  }
}
