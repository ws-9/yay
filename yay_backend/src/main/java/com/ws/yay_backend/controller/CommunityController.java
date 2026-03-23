package com.ws.yay_backend.controller;

import com.ws.yay_backend.dto.request.CommunityBatchRequest;
import com.ws.yay_backend.dto.request.CreateCommunityRequest;
import com.ws.yay_backend.dto.response.CommunityResponse;
import com.ws.yay_backend.service.CommunityService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@Tag(name = "Communities V2")
@RestController
@RequestMapping("/api/v2/communities")
public class CommunityController {
  private final CommunityService communityService;

  public CommunityController(CommunityService communityService) {
    this.communityService = communityService;
  }

  @Operation(summary = "Get user's joined communities")
  @GetMapping
  public List<CommunityResponse> getCommunities(
      @RequestParam(value = "joined", defaultValue = "true") boolean joined) {
    if (joined) {
      return communityService.getJoinedCommunities();
    }
    // Future: handle joined=false for a public directory
    return List.of();
  }

  @Operation(summary = "Create a community")
  @PostMapping
  @ResponseStatus(HttpStatus.CREATED)
  public CommunityResponse createCommunity(@RequestBody @Valid CreateCommunityRequest request) {
    return communityService.createCommunity(request);
  }

  @Operation(summary = "Get community by id")
  @GetMapping("/{id}")
  public CommunityResponse getCommunity(@PathVariable long id) {
    return communityService.getCommunity(id);
  }

  @Operation(summary = "Batch fetch communities")
  @PostMapping("/batch")
  public List<CommunityResponse> getCommunitiesBatch(
      @RequestBody @Valid CommunityBatchRequest request) {
    return communityService.getCommunitiesBatch(request);
  }

  @Operation(summary = "Delete community")
  @DeleteMapping("/{id}")
  @ResponseStatus(HttpStatus.NO_CONTENT)
  public void deleteCommunity(@PathVariable long id) {
    communityService.deleteCommunity(id);
  }
}
