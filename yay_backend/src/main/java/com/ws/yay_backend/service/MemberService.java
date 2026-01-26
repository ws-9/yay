package com.ws.yay_backend.service;

import com.ws.yay_backend.dto.request.JoinCommunityRequest;
import com.ws.yay_backend.dto.request.RemoveMemberRequest;
import com.ws.yay_backend.dto.response.GetMembersRolesResponse;
import com.ws.yay_backend.dto.response.JoinCommunityResponse;

import java.util.List;

public interface MemberService {
  JoinCommunityResponse joinCommunity(JoinCommunityRequest request);

  void deleteMember(RemoveMemberRequest request);

  GetMembersRolesResponse getRolesByUserIds(Long communityId, List<Long> userIds);
}

