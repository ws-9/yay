package com.ws.yay_backend.controller;

import com.ws.yay_backend.dto.response.UserResponse;
import com.ws.yay_backend.service.UserInfoService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Tag(name = "User Info V2")
@RestController
@RequestMapping("/api/v2/me")
public class UserInfoController {
  private final UserInfoService userInfoService;

  public UserInfoController(UserInfoService userInfoService) {
    this.userInfoService = userInfoService;
  }

  @Operation(summary = "Get own user info")
  @GetMapping
  public UserResponse getOwnInfo() {
    return userInfoService.getOwnUserInfo();
  }
}
