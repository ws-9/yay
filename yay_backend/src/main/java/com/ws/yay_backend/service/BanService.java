package com.ws.yay_backend.service;

import com.ws.yay_backend.dto.v1.request.CreateBanRequest;
import com.ws.yay_backend.dto.v1.response.BannedUserResponse;
import java.util.List;

public interface BanService {
  List<BannedUserResponse> getBannedUsers(Long communityId);

  BannedUserResponse banUser(CreateBanRequest request);
}
