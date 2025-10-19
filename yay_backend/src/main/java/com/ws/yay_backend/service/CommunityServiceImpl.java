package com.ws.yay_backend.service;

import com.ws.yay_backend.dao.CommunityRepository;
import com.ws.yay_backend.response.GetCommunityResponse;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CommunityServiceImpl implements CommunityService {
  private final CommunityRepository communityRepository;

  public CommunityServiceImpl(CommunityRepository communityRepository) {
    this.communityRepository = communityRepository;
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
}
