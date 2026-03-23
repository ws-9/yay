package com.ws.yay_backend.service;

import com.ws.yay_backend.components.AuthUtilsComponent;
import com.ws.yay_backend.dao.CommunityMemberRepository;
import com.ws.yay_backend.dto.response.InviteResponseV2;
import com.ws.yay_backend.entity.CommunityMember;
import com.ws.yay_backend.entity.embedded.CommunityMemberKey;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
public class InviteServiceImpl implements InviteService {

  private final CommunityMemberRepository communityMemberRepository;
  private final AuthUtilsComponent authUtilsComponent;

  public InviteServiceImpl(
      CommunityMemberRepository communityMemberRepository, AuthUtilsComponent authUtilsComponent) {
    this.communityMemberRepository = communityMemberRepository;
    this.authUtilsComponent = authUtilsComponent;
  }

  @Override
  @Transactional(readOnly = true)
  public InviteResponseV2 getInvite(long communityId) {
    Long userId = authUtilsComponent.getAuthenticatedUserId();

    // In V1, the logic used findWithCommunityByKey to both check membership
    // and fetch the community in a single query.
    CommunityMember membership =
        communityMemberRepository
            .findWithCommunityByKey(new CommunityMemberKey(communityId, userId))
            .orElseThrow(
                () -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Community not found"));

    return new InviteResponseV2(
        membership.getCommunity().getId(), membership.getCommunity().getInviteSlug());
  }
}
