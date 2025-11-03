package com.ws.yay_backend.service;

import com.ws.yay_backend.dto.request.JoinCommunityRequest;
import com.ws.yay_backend.dto.request.RemoveMemberRequest;
import com.ws.yay_backend.dto.response.JoinCommunityResponse;

public interface MemberService {
  JoinCommunityResponse joinCommunity(JoinCommunityRequest request);

  void deleteMember(RemoveMemberRequest request);
}
