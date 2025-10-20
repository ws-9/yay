package com.ws.yay_backend.service;

import com.ws.yay_backend.request.CreateCommunityRequest;
import com.ws.yay_backend.response.GetCommunityResponse;
import com.ws.yay_backend.response.GetMemberResponse;
import jakarta.validation.constraints.Min;

import java.util.List;

public interface CommunityService {
  List<GetCommunityResponse> getAll();

  GetCommunityResponse createCommunity(CreateCommunityRequest request);

  void deleteCommunity(long id);

  List<GetMemberResponse> getAllMembers(@Min(value = 1) Long id);
}
