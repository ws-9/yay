package com.ws.yay_backend.service;

import com.ws.yay_backend.dao.CommunityRepository;
import com.ws.yay_backend.dao.UserRepository;
import com.ws.yay_backend.entity.Community;
import com.ws.yay_backend.entity.User;
import com.ws.yay_backend.dto.request.JoinCommunityRequest;
import com.ws.yay_backend.dto.request.RemoveMemberRequest;
import com.ws.yay_backend.dto.response.JoinCommunityResponse;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
public class MemberServiceImpl implements MemberService {
  private final UserRepository userRepository;
  private final CommunityRepository communityRepository;

  public MemberServiceImpl(UserRepository userRepository, CommunityRepository communityRepository) {
    this.userRepository = userRepository;
    this.communityRepository = communityRepository;
  }

  @Override
  @Transactional
  // TODO: implement banned_users table and check current user against it.
  public JoinCommunityResponse joinCommunity(JoinCommunityRequest request) {
    Authentication auth = SecurityContextHolder.getContext().getAuthentication();

    String username = auth.getName();
    User user = userRepository.findByUsername(username)
        .orElseThrow(() -> new ResponseStatusException(
            HttpStatus.INTERNAL_SERVER_ERROR,
            "Authenticated user not found: " + username
        ));

    Community community = communityRepository.findWithMembersById(request.communityId())
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Community not found: " + request.communityId()));

    boolean userAlreadyMember = communityRepository.existsByIdAndMembers_Id(request.communityId(), user.getId());
    if (!userAlreadyMember) {
      community.getMembers().add(user);
      communityRepository.save(community);
    }

    return new JoinCommunityResponse(user.getId(), user.getUsername());
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
