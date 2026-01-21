package com.ws.yay_backend.service;

import com.ws.yay_backend.components.AuthUtilsComponent;
import com.ws.yay_backend.dto.response.UserInfoResponse;
import com.ws.yay_backend.entity.User;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UserInfoServiceImpl implements UserInfoService {
  private final AuthUtilsComponent authUtilsComponent;

  public UserInfoServiceImpl(AuthUtilsComponent authUtilsComponent) {
    this.authUtilsComponent = authUtilsComponent;
  }

  @Override
  @Transactional(readOnly = true)
  public UserInfoResponse getOwnUserInfo() {
    User user = authUtilsComponent.getAuthenticatedUser();

    return new UserInfoResponse(user.getUsername(), user.getId());
  }
}
