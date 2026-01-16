package com.ws.yay_backend.service;

import com.ws.yay_backend.components.AuthUtilsComponent;
import com.ws.yay_backend.dao.CommunityRepository;
import com.ws.yay_backend.dao.UserRepository;
import com.ws.yay_backend.entity.Community;
import com.ws.yay_backend.entity.User;
import com.ws.yay_backend.dto.request.JoinCommunityRequest;
import com.ws.yay_backend.dto.request.RemoveMemberRequest;
import com.ws.yay_backend.dto.response.JoinCommunityResponse;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
public class MemberServiceImpl implements MemberService {
  private final UserRepository userRepository;
  private final CommunityRepository communityRepository;
  private final AuthUtilsComponent authUtilsComponent;

  public MemberServiceImpl(UserRepository userRepository, CommunityRepository communityRepository, AuthUtilsComponent authUtilsComponent) {
    this.userRepository = userRepository;
    this.communityRepository = communityRepository;
    this.authUtilsComponent = authUtilsComponent;
  }

  @Override
  @Transactional
  // TODO: implement banned_users table and check current user against it.
  public JoinCommunityResponse joinCommunity(JoinCommunityRequest request) {
    User user = authUtilsComponent.getAuthenticatedUser();

    if (!communityRepository.existsById(request.communityId())) {
      throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Community not found: " + request.communityId());
    }

    int rowsInserted = communityRepository.addMember(request.communityId(), user.getId());
    boolean isNewMember = rowsInserted > 0;

    return new JoinCommunityResponse(user.getId(), user.getUsername(), isNewMember);
  }

  @Override
  @Transactional
  @PreAuthorize("""
      hasRole('ADMIN') or
      @communityRepository.existsByIdAndOwner_Id(#request.communityId, authentication.principal.id) or
      (@communityRepository.existsByIdAndMembers_Id(#request.communityId, authentication.principal.id) and
      #request.userId() == authentication.principal.id)
      """)
  public void deleteMember(RemoveMemberRequest request) {
    if (!userRepository.existsById(request.userId())) {
      throw new ResponseStatusException(HttpStatus.NOT_FOUND, "User id not found in database: " + request.userId());
    }

    long communityOwnerId = communityRepository.findById(request.communityId())
        .map(c -> c.getOwner().getId())
        .orElseThrow(() -> new ResponseStatusException(
            HttpStatus.NOT_FOUND,
            "Community id not found in database: " + request.communityId()
        ));

    if (communityOwnerId == request.userId()) {
      throw new ResponseStatusException(HttpStatus.CONFLICT, "Cannot remove the community owner");
    }

    communityRepository.deleteMember(request.communityId(), request.userId());
  }
}
