package com.ws.yay_backend.service;

import com.ws.yay_backend.dto.v1.response.UserInfoResponse;
import com.ws.yay_backend.dto.v2.response.UserResponseV2;

public interface UserInfoService {
  UserInfoResponse getOwnUserInfo();

  UserResponseV2 getOwnUserInfoV2();
}
