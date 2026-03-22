package com.ws.yay_backend.service;

import com.ws.yay_backend.dto.v1.response.UserInfoResponse;

public interface UserInfoService {
  UserInfoResponse getOwnUserInfo();
}
