package com.ws.yay_backend.service;

import com.ws.yay_backend.dto.response.AppBootstrapResponse;
import com.ws.yay_backend.dto.response.GetCommunityResponse;
import com.ws.yay_backend.dto.response.UserInfoResponse;
import com.ws.yay_backend.components.AuthUtilsComponent;
import com.ws.yay_backend.entity.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class BootstrapServiceImpl implements BootstrapService {
  private final AuthUtilsComponent authUtilsComponent;
  private final CommunityService communityService;

  @Autowired
  public BootstrapServiceImpl(
      AuthUtilsComponent authUtilsComponent,
      CommunityService communityService
  ) {
    this.authUtilsComponent = authUtilsComponent;
    this.communityService = communityService;
  }

  @Override
  @Transactional(readOnly = true)
  public AppBootstrapResponse getBootstrapData() {
    User user = authUtilsComponent.getAuthenticatedUser();
    List<GetCommunityResponse> communities = communityService.getUserOwnCommunities();
    
    UserInfoResponse userInfo = new UserInfoResponse(user.getUsername(), user.getId());
    
    return new AppBootstrapResponse(communities, userInfo);
  }
}
