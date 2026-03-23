package com.ws.yay_backend.service;

import com.ws.yay_backend.dto.request.CommunityBatchRequestV2;
import com.ws.yay_backend.dto.request.CreateCommunityRequestV2;
import com.ws.yay_backend.dto.request.RenameCommunityRequest;
import com.ws.yay_backend.dto.request.TransferOwnershipRequest;
import com.ws.yay_backend.dto.response.CommunityResponseV2;
import java.util.List;

public interface CommunityService {

  void transferOwnership(long communityId, TransferOwnershipRequest request);

  CommunityResponseV2 renameCommunity(long communityId, RenameCommunityRequest request);

  // V2 Methods
  List<CommunityResponseV2> getJoinedCommunitiesV2();

  CommunityResponseV2 createCommunityV2(CreateCommunityRequestV2 request);

  CommunityResponseV2 getCommunityV2(long id);

  List<CommunityResponseV2> getCommunitiesBatchV2(CommunityBatchRequestV2 request);

  void deleteCommunityV2(long id);
}
