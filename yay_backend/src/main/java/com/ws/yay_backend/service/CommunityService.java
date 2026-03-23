package com.ws.yay_backend.service;

import com.ws.yay_backend.dto.request.CommunityBatchRequest;
import com.ws.yay_backend.dto.request.CreateCommunityRequest;
import com.ws.yay_backend.dto.request.RenameCommunityRequest;
import com.ws.yay_backend.dto.request.TransferOwnershipRequest;
import com.ws.yay_backend.dto.response.CommunityResponse;
import java.util.List;

public interface CommunityService {

  void transferOwnership(long communityId, TransferOwnershipRequest request);

  CommunityResponse renameCommunity(long communityId, RenameCommunityRequest request);

  // V2 Methods
  List<CommunityResponse> getJoinedCommunities();

  CommunityResponse createCommunity(CreateCommunityRequest request);

  CommunityResponse getCommunity(long id);

  List<CommunityResponse> getCommunitiesBatch(CommunityBatchRequest request);

  void deleteCommunity(long id);
}
