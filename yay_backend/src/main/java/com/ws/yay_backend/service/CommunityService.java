package com.ws.yay_backend.service;

import com.ws.yay_backend.dto.v1.request.CreateCommunityRequest;
import com.ws.yay_backend.dto.v1.request.RenameCommunityRequest;
import com.ws.yay_backend.dto.v1.request.TransferOwnershipRequest;
import com.ws.yay_backend.dto.v1.response.GetChannelResponse;
import com.ws.yay_backend.dto.v1.response.GetCommunityInviteResponse;
import com.ws.yay_backend.dto.v1.response.GetCommunityResponse;
import com.ws.yay_backend.dto.v1.response.GetMemberResponse;
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
}
