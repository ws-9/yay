package com.ws.yay_backend.service;

import com.ws.yay_backend.request.JoinCommunityRequest;
import com.ws.yay_backend.request.RemoveMemberRequest;
import com.ws.yay_backend.response.JoinCommunityResponse;

public interface MemberService {
  JoinCommunityResponse joinCommunity(JoinCommunityRequest request);

  void deleteMember(RemoveMemberRequest request);
}
