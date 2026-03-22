package com.ws.yay_backend.dao;

import com.ws.yay_backend.entity.CommunityRole;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CommunityRoleRepository extends JpaRepository<CommunityRole, Long> {
  Optional<CommunityRole> findByName(String name);
}
