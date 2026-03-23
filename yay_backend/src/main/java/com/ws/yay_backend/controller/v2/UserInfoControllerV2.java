package com.ws.yay_backend.controller.v2;

import com.ws.yay_backend.dto.v2.response.UserResponseV2;
import com.ws.yay_backend.service.UserInfoService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Tag(name = "User Info V2")
@RestController
@RequestMapping("/api/v2/me")
public class UserInfoControllerV2 {
  private final UserInfoService userInfoService;

  public UserInfoControllerV2(UserInfoService userInfoService) {
    this.userInfoService = userInfoService;
  }

  @Operation(summary = "Get own user info")
  @GetMapping
  public UserResponseV2 getOwnInfo() {
    return userInfoService.getOwnUserInfoV2();
  }
}
