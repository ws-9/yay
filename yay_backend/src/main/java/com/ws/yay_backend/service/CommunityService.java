package com.ws.yay_backend.service;

import com.ws.yay_backend.request.CreateCommunityRequest;
import com.ws.yay_backend.response.GetChannelResponse;
import com.ws.yay_backend.response.GetCommunityResponse;
import com.ws.yay_backend.response.GetMemberResponse;
import com.ws.yay_backend.response.JoinCommunityResponse;

import java.util.List;

public interface CommunityService {
  List<GetCommunityResponse> getAll();

  GetCommunityResponse createCommunity(CreateCommunityRequest request);

  GetCommunityResponse getCommunity(long id);

  void deleteCommunity(long id);

  List<GetMemberResponse> getAllMembers(Long id);

  JoinCommunityResponse joinCommunity(Long communityId);

  void deleteMember(Long communityId, Long userId);

  List<GetCommunityResponse> getUserOwnCommunities();

  List<GetChannelResponse> getCommunityChannels(Long communityId);
}
