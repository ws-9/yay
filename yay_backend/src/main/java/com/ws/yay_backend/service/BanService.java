package com.ws.yay_backend.service;

import com.ws.yay_backend.dto.request.CreateBanRequest;
import com.ws.yay_backend.dto.response.BannedUserResponse;

import java.util.List;

public interface BanService {
  List<BannedUserResponse> getBannedUsers(Long communityId);

  BannedUserResponse banUser(CreateBanRequest request);
}