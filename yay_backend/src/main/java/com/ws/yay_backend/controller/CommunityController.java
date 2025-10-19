package com.ws.yay_backend.controller;

import com.ws.yay_backend.response.GetCommunityResponse;
import com.ws.yay_backend.service.CommunityService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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
}
