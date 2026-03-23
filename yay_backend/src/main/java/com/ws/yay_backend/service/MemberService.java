package com.ws.yay_backend.service;

import com.ws.yay_backend.dto.request.JoinCommunityRequest;
import com.ws.yay_backend.dto.request.UpdateMemberRoleRequest;
import com.ws.yay_backend.dto.request.UpdateRoleRequest;
import com.ws.yay_backend.dto.response.MemberResponse;
import java.util.List;

public interface MemberService {

  MemberResponse updateRole(UpdateRoleRequest request);

  // V2 Methods
  MemberResponse joinCommunity(JoinCommunityRequest request);

  MemberResponse updateMemberRole(long communityId, long userId, UpdateMemberRoleRequest request);

  void deleteMember(long communityId, long userId);

  List<MemberResponse> getMembersByCommunity(long communityId);

  MemberResponse getMember(long communityId, long userId);
}
