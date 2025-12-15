package com.ws.yay_backend.service;

import com.ws.yay_backend.dao.ChannelRepository;
import com.ws.yay_backend.dao.CommunityRepository;
import com.ws.yay_backend.dao.UserRepository;
import com.ws.yay_backend.dto.response.GetCommunityWithChannelsResponse;
import com.ws.yay_backend.entity.Channel;
import com.ws.yay_backend.entity.Community;
import com.ws.yay_backend.entity.User;
import com.ws.yay_backend.dto.request.CreateCommunityRequest;
import com.ws.yay_backend.dto.response.GetChannelResponse;
import com.ws.yay_backend.dto.response.GetCommunityResponse;
import com.ws.yay_backend.dto.response.GetMemberResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class CommunityServiceImpl implements CommunityService {
  private final CommunityRepository communityRepository;
  private final UserRepository userRepository;
  private final ChannelRepository channelRepository;

  @Autowired
  public CommunityServiceImpl(CommunityRepository communityRepository, UserRepository userRepository, ChannelRepository channelRepository) {
    this.communityRepository = communityRepository;
    this.userRepository = userRepository;
    this.channelRepository = channelRepository;
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

    String username = auth.getName();
    User owner = userRepository.findByUsername(username)
        .orElseThrow(() -> new ResponseStatusException(
            HttpStatus.INTERNAL_SERVER_ERROR,
            "Authenticated user not found: " + username
        ));

    Community community = new Community(request.getName(), owner, Set.of(owner));
    Community saved = communityRepository.save(community);

    return new GetCommunityResponse(
        saved.getId(),
        saved.getName(),
        saved.getOwner().getId(),
        saved.getOwner().getUsername()
    );
  }

  @Override
  @Transactional(readOnly = true)
  public GetCommunityResponse getCommunity(long id) {
    Community community = communityRepository.findById(id)
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Community not found"));
    return new GetCommunityResponse(
        community.getId(),
        community.getName(),
        community.getOwner().getId(),
        community.getOwner().getUsername()
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
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Community not found: " + id));
  }

  @Override
  @Transactional(readOnly = true)
  public List<GetCommunityWithChannelsResponse> getUserOwnCommunities() {
    Authentication auth = SecurityContextHolder.getContext().getAuthentication();

    String username = auth.getName();
    User user = userRepository.findByUsername(username)
        .orElseThrow(() -> new ResponseStatusException(
            HttpStatus.INTERNAL_SERVER_ERROR,
            "Authenticated user not found: " + username
        ));

    List<Community> communities = communityRepository.findByMembers_id(user.getId());

    if (communities.isEmpty()) {
      return List.of();
    }

    List<Long> communityIds = communities.stream().map(Community::getId).toList();

    List<Channel> channels = channelRepository.findAllByCommunity_IdIn(communityIds);
    Map<Long, List<GetChannelResponse>> communityIdToChannels = channels.stream()
        .map(c -> new GetChannelResponse(
            c.getId(),
            c.getName(),
            c.getCommunity().getId()
        ))
        .collect(Collectors.groupingBy(
            GetChannelResponse::communityId
        ));

    return communities.stream()
        .map( c -> new GetCommunityWithChannelsResponse(
            c.getId(),
            c.getName(),
            c.getOwner().getId(),
            c.getOwner().getUsername(),
            communityIdToChannels.getOrDefault(c.getId(), List.of())
        )).toList();
  }

  @Override
  @Transactional(readOnly = true)
  @PreAuthorize("""
      hasRole('ADMIN') or
      @communityRepository.existsByIdAndMembers_Id(#communityId, authentication.principal.id)
      """)
  public List<GetChannelResponse> getCommunityChannels(Long communityId) {
    return channelRepository.findAllByCommunity_Id(communityId).stream()
        .map(channel -> new GetChannelResponse(
            channel.getId(),
            channel.getName(),
            channel.getCommunity().getId()
        )).toList();
  }
}
