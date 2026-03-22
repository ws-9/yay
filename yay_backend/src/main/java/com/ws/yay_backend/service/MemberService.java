package com.ws.yay_backend.service;

import com.ws.yay_backend.dto.v1.request.JoinCommunityRequest;
import com.ws.yay_backend.dto.v1.request.RemoveMemberRequest;
import com.ws.yay_backend.dto.v1.request.UpdateRoleRequest;
import com.ws.yay_backend.dto.v1.response.GetMemberResponse;
import com.ws.yay_backend.dto.v1.response.GetMembersRolesResponse;
import com.ws.yay_backend.dto.v1.response.JoinCommunityResponse;
import java.util.List;

public interface MemberService {
  JoinCommunityResponse joinCommunity(JoinCommunityRequest request);

  void deleteMember(RemoveMemberRequest request);

  GetMembersRolesResponse getRolesByUserIds(Long communityId, List<Long> userIds);

  GetMemberResponse updateRole(UpdateRoleRequest request);
}
