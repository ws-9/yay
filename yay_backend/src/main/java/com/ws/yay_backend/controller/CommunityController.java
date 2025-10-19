package com.ws.yay_backend.controller;

import com.ws.yay_backend.request.CreateCommunityRequest;
import com.ws.yay_backend.response.GetCommunityResponse;
import com.ws.yay_backend.service.CommunityService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/communities")
public class CommunityController {
  private final CommunityService communityService;

  public CommunityController(CommunityService communityService) {
    this.communityService = communityService;
  }

  @GetMapping
  public List<GetCommunityResponse> getAllCommunities() {
    return communityService.getAll();
  }

  @PostMapping
  @ResponseStatus(HttpStatus.CREATED)
  GetCommunityResponse createCommunity(@RequestBody @Valid CreateCommunityRequest request) {
    return communityService.createCommunity(request);
  }
}
