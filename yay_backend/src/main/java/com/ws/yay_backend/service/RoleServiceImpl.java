package com.ws.yay_backend.service;

import com.ws.yay_backend.dao.CommunityRoleRepository;
import com.ws.yay_backend.dto.response.RoleResponse;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class RoleServiceImpl implements RoleService {
  private final CommunityRoleRepository communityRoleRepository;

  public RoleServiceImpl(CommunityRoleRepository communityRoleRepository) {
    this.communityRoleRepository = communityRoleRepository;
  }

  @Override
  @Transactional(readOnly = true)
  public List<RoleResponse> getRoles() {
    return communityRoleRepository.findAll().stream().map(RoleResponse::fromEntity).toList();
  }
}
