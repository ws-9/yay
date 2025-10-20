package com.ws.yay_backend.service;

import com.ws.yay_backend.dao.CommunityRepository;
import com.ws.yay_backend.dao.UserRepository;
import com.ws.yay_backend.entity.Community;
import com.ws.yay_backend.entity.User;
import com.ws.yay_backend.request.CreateCommunityRequest;
import com.ws.yay_backend.response.GetCommunityResponse;
import com.ws.yay_backend.response.GetMemberResponse;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CommunityServiceImpl implements CommunityService {
  private final CommunityRepository communityRepository;
  private final UserRepository userRepository;

  @Autowired
  public CommunityServiceImpl(CommunityRepository communityRepository, UserRepository userRepository) {
    this.communityRepository = communityRepository;
    this.userRepository = userRepository;
  }

  @Override
  public List<GetCommunityResponse> getAll() {
    return communityRepository.findAll().stream()
        .map(community -> new GetCommunityResponse(
            community.getId(),
            community.getName(),
            community.getOwner().getId(),
            community.getOwner().getUsername()
        ))
        .collect(Collectors.toList());
  }

  @Override
  @Transactional
  public GetCommunityResponse createCommunity(CreateCommunityRequest request) {
    Authentication auth = SecurityContextHolder.getContext().getAuthentication();
    if (auth == null || auth.getName() == null) {
      throw new IllegalStateException("No authenticated user found");
    }

    String username = auth.getName();
    User owner = userRepository.findByUsername(username)
        .orElseThrow(() -> new IllegalStateException("Authenticated user not found in database: " + username));

    Community community = new Community(request.getName(), owner);
    Community saved = communityRepository.save(community);

    return new GetCommunityResponse(
        saved.getId(),
        saved.getName(),
        saved.getOwner().getId(),
        saved.getOwner().getUsername()
    );
  }

  @Override
  @Transactional
  @PreAuthorize("hasRole('ADMIN') or @communityRepository.existsByIdAndOwner_Id(#id, authentication.principal.id)")
  public void deleteCommunity(long id) {
    communityRepository.deleteById(id);
  }

  @Override
  @Transactional(readOnly = true)
  @PreAuthorize("hasRole('ADMIN') or @communityRepository.existsByIdAndMembers_Id(#id, authentication.principal.id)")
  public List<GetMemberResponse> getAllMembers(Long id) {
    return communityRepository.findWithMembersById(id)
        .map(c -> c.getMembers().stream()
            .map(u -> new GetMemberResponse(u.getId(), u.getUsername()))
            .collect(Collectors.toList())
        )
        .orElseThrow(() -> new IllegalStateException(("Community not found: " + id)));
  }
}
