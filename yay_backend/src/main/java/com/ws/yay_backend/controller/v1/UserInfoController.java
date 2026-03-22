package com.ws.yay_backend.controller.v1;

import com.ws.yay_backend.dto.v1.response.UserInfoResponse;
import com.ws.yay_backend.service.UserInfoService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Tag(name = "User info")
@RestController
@RequestMapping("/api/v1/me")
public class UserInfoController {
  private final UserInfoService userInfoService;

  @Autowired
  public UserInfoController(UserInfoService userInfoService) {
    this.userInfoService = userInfoService;
  }

  @Operation(summary = "Get own user info")
  @GetMapping
  public UserInfoResponse getOwnInfo() {
    return userInfoService.getOwnUserInfo();
  }
}
