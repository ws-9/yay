package com.ws.yay_backend.dao;

import com.ws.yay_backend.entity.CommunityRole;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CommunityRoleRepository extends JpaRepository<CommunityRole, Long> {
  Optional<CommunityRole> findByName(String name);
}
