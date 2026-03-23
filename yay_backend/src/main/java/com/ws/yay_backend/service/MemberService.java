package com.ws.yay_backend.service;

import com.ws.yay_backend.dto.v1.request.JoinCommunityRequest;
import com.ws.yay_backend.dto.v1.request.RemoveMemberRequest;
import com.ws.yay_backend.dto.v1.request.UpdateRoleRequest;
import com.ws.yay_backend.dto.v1.response.GetMemberResponse;
import com.ws.yay_backend.dto.v1.response.GetMembersRolesResponse;
import com.ws.yay_backend.dto.v1.response.JoinCommunityResponse;
import com.ws.yay_backend.dto.v2.request.JoinCommunityRequestV2;
import com.ws.yay_backend.dto.v2.request.UpdateMemberRoleRequestV2;
import com.ws.yay_backend.dto.v2.response.MemberResponseV2;
import java.util.List;

public interface MemberService {
  JoinCommunityResponse joinCommunity(JoinCommunityRequest request);

  void deleteMember(RemoveMemberRequest request);

  GetMembersRolesResponse getRolesByUserIds(Long communityId, List<Long> userIds);

  GetMemberResponse updateRole(UpdateRoleRequest request);

  // V2 Methods
  MemberResponseV2 joinCommunityV2(JoinCommunityRequestV2 request);

  MemberResponseV2 updateMemberRoleV2(
      long communityId, long userId, UpdateMemberRoleRequestV2 request);

  void deleteMemberV2(long communityId, long userId);

  List<MemberResponseV2> getMembersByCommunityV2(long communityId);

  MemberResponseV2 getMemberV2(long communityId, long userId);
}
