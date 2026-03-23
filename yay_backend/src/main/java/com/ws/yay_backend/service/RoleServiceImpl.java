package com.ws.yay_backend.service;

import com.ws.yay_backend.dao.CommunityRoleRepository;
import com.ws.yay_backend.dto.v2.response.RoleResponseV2;
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
  public List<RoleResponseV2> getRolesV2() {
    return communityRoleRepository.findAll().stream().map(RoleResponseV2::fromEntity).toList();
  }
}
