package com.ws.yay_backend.service;

import com.ws.yay_backend.dto.v1.request.CreateCommunityRequest;
import com.ws.yay_backend.dto.v1.request.RenameCommunityRequest;
import com.ws.yay_backend.dto.v1.request.TransferOwnershipRequest;
import com.ws.yay_backend.dto.v1.response.GetChannelResponse;
import com.ws.yay_backend.dto.v1.response.GetCommunityInviteResponse;
import com.ws.yay_backend.dto.v1.response.GetCommunityResponse;
import com.ws.yay_backend.dto.v1.response.GetMemberResponse;
import com.ws.yay_backend.dto.v2.request.CommunityBatchRequestV2;
import com.ws.yay_backend.dto.v2.request.CreateCommunityRequestV2;
import com.ws.yay_backend.dto.v2.response.CommunityResponseV2;
import java.util.List;

public interface CommunityService {
  List<GetCommunityResponse> getAll();

  GetCommunityResponse createCommunity(CreateCommunityRequest request);

  GetCommunityResponse getCommunity(long id);

  void deleteCommunity(long id);

  List<GetMemberResponse> getAllMembers(Long id);

  List<GetCommunityResponse> getUserOwnCommunities();

  List<GetChannelResponse> getCommunityChannels(Long communityId);

  GetCommunityInviteResponse getCommunityInvite(long id);

  void transferOwnership(long communityId, TransferOwnershipRequest request);

  GetCommunityResponse renameCommunity(long communityId, RenameCommunityRequest request);

  // V2 Methods
  List<CommunityResponseV2> getJoinedCommunitiesV2();

  CommunityResponseV2 createCommunityV2(CreateCommunityRequestV2 request);

  CommunityResponseV2 getCommunityV2(long id);

  List<CommunityResponseV2> getCommunitiesBatchV2(CommunityBatchRequestV2 request);

  void deleteCommunityV2(long id);
}
