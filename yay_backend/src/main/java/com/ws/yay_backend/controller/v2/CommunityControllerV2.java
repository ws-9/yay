package com.ws.yay_backend.controller.v2;

import com.ws.yay_backend.dto.v2.request.CommunityBatchRequestV2;
import com.ws.yay_backend.dto.v2.request.CreateCommunityRequestV2;
import com.ws.yay_backend.dto.v2.response.CommunityResponseV2;
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
public class CommunityControllerV2 {
  private final CommunityService communityService;

  public CommunityControllerV2(CommunityService communityService) {
    this.communityService = communityService;
  }

  @Operation(summary = "Get user's joined communities")
  @GetMapping
  public List<CommunityResponseV2> getCommunities(
      @RequestParam(value = "joined", defaultValue = "true") boolean joined) {
    if (joined) {
      return communityService.getJoinedCommunitiesV2();
    }
    // Future: handle joined=false for a public directory
    return List.of();
  }

  @Operation(summary = "Create a community")
  @PostMapping
  @ResponseStatus(HttpStatus.CREATED)
  public CommunityResponseV2 createCommunity(@RequestBody @Valid CreateCommunityRequestV2 request) {
    return communityService.createCommunityV2(request);
  }

  @Operation(summary = "Get community by id")
  @GetMapping("/{id}")
  public CommunityResponseV2 getCommunity(@PathVariable long id) {
    return communityService.getCommunityV2(id);
  }

  @Operation(summary = "Batch fetch communities")
  @PostMapping("/batch")
  public List<CommunityResponseV2> getCommunitiesBatch(
      @RequestBody @Valid CommunityBatchRequestV2 request) {
    return communityService.getCommunitiesBatchV2(request);
  }

  @Operation(summary = "Delete community")
  @DeleteMapping("/{id}")
  @ResponseStatus(HttpStatus.NO_CONTENT)
  public void deleteCommunity(@PathVariable long id) {
    communityService.deleteCommunityV2(id);
  }
}
