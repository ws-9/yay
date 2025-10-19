package com.ws.yay_backend.service;

import com.ws.yay_backend.response.GetCommunityResponse;

import java.util.List;

public interface CommunityService {
  List<GetCommunityResponse> getAll();
}
