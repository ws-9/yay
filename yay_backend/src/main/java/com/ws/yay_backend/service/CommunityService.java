package com.ws.yay_backend.service;

import com.ws.yay_backend.dto.request.CreateCommunityRequest;
import com.ws.yay_backend.dto.response.GetChannelResponse;
import com.ws.yay_backend.dto.response.GetCommunityResponse;
import com.ws.yay_backend.dto.response.GetCommunityWithChannelsResponse;
import com.ws.yay_backend.dto.response.GetMemberResponse;

import java.util.List;

public interface CommunityService {
  List<GetCommunityResponse> getAll();

  GetCommunityResponse createCommunity(CreateCommunityRequest request);

  GetCommunityResponse getCommunity(long id);

  void deleteCommunity(long id);

  List<GetMemberResponse> getAllMembers(Long id);

  List<GetCommunityWithChannelsResponse> getUserOwnCommunities();

  List<GetChannelResponse> getCommunityChannels(Long communityId);
}
