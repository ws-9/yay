package com.ws.yay_backend.service;

import com.ws.yay_backend.dto.request.JoinCommunityRequestV2;
import com.ws.yay_backend.dto.request.UpdateMemberRoleRequestV2;
import com.ws.yay_backend.dto.request.UpdateRoleRequest;
import com.ws.yay_backend.dto.response.MemberResponseV2;
import java.util.List;

public interface MemberService {

  MemberResponseV2 updateRole(UpdateRoleRequest request);

  // V2 Methods
  MemberResponseV2 joinCommunityV2(JoinCommunityRequestV2 request);

  MemberResponseV2 updateMemberRoleV2(
      long communityId, long userId, UpdateMemberRoleRequestV2 request);

  void deleteMemberV2(long communityId, long userId);

  List<MemberResponseV2> getMembersByCommunityV2(long communityId);

  MemberResponseV2 getMemberV2(long communityId, long userId);
}
