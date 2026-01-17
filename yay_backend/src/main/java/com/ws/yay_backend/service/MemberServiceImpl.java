package com.ws.yay_backend.service;

import com.ws.yay_backend.components.AuthUtilsComponent;
import com.ws.yay_backend.dao.CommunityMemberRepository;
import com.ws.yay_backend.dao.CommunityRepository;
import com.ws.yay_backend.dao.CommunityRoleRepository;
import com.ws.yay_backend.dao.UserRepository;
import com.ws.yay_backend.entity.Community;
import com.ws.yay_backend.entity.CommunityMember;
import com.ws.yay_backend.entity.CommunityRole;
import com.ws.yay_backend.entity.User;
import com.ws.yay_backend.entity.embedded.CommunityMemberKey;
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
  private final CommunityMemberRepository communityMemberRepository;
  private final CommunityRoleRepository communityRoleRepository;
  private final AuthUtilsComponent authUtilsComponent;
  private static final String DEFAULT_MEMBER_ROLE_NAME = "Member";

  public MemberServiceImpl(
      UserRepository userRepository,
      CommunityRepository communityRepository,
      CommunityMemberRepository communityMemberRepository,
      CommunityRoleRepository communityRoleRepository,
      AuthUtilsComponent authUtilsComponent
  ) {
    this.userRepository = userRepository;
    this.communityRepository = communityRepository;
    this.communityMemberRepository = communityMemberRepository;
    this.communityRoleRepository = communityRoleRepository;
    this.authUtilsComponent = authUtilsComponent;
  }

  @Override
  @Transactional
  // TODO: implement banned_users table and check current user against it.
  public JoinCommunityResponse joinCommunity(JoinCommunityRequest request) {
    User user = authUtilsComponent.getAuthenticatedUser();

    Community community = communityRepository.findById(request.communityId())
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Community not found: " + request.communityId()));

    // Check if already a member
    boolean alreadyMember = communityMemberRepository.existsByKey_CommunityIdAndKey_UserId(
        request.communityId(),
        user.getId()
    );

    if (!alreadyMember) {
      CommunityRole memberRole = communityRoleRepository.findByName(DEFAULT_MEMBER_ROLE_NAME)
          .orElseThrow(() -> new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Default member role not found"));

      CommunityMember communityMember = new CommunityMember(community, user, memberRole);
      communityMemberRepository.save(communityMember);
    }

    return new JoinCommunityResponse(user.getId(), user.getUsername(), !alreadyMember);
  }

  @Override
  @Transactional
  @PreAuthorize("""
      hasRole('ADMIN') or
      @communityRepository.existsByIdAndOwner_Id(#request.communityId, authentication.principal.id) or
      (@communityMemberRepository.existsByKey_CommunityIdAndKey_UserId(#request.communityId, authentication.principal.id) and
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

    CommunityMemberKey key = new CommunityMemberKey(request.communityId(), request.userId());
    communityMemberRepository.deleteById(key);
  }
}
