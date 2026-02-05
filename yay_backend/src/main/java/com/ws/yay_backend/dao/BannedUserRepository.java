package com.ws.yay_backend.dao;

import com.ws.yay_backend.entity.BannedUser;
import com.ws.yay_backend.entity.embedded.BannedUserKey;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BannedUserRepository extends JpaRepository<BannedUser, BannedUserKey> {
  @EntityGraph(attributePaths = {"user", "community"})
  List<BannedUser> findAllWithUserAndCommunityByKey_CommunityId(Long communityId);
}