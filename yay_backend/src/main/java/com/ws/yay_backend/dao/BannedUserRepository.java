package com.ws.yay_backend.dao;

import com.ws.yay_backend.entity.BannedUser;
import com.ws.yay_backend.entity.embedded.BannedUserKey;
import java.util.List;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BannedUserRepository extends JpaRepository<BannedUser, BannedUserKey> {
  @EntityGraph(attributePaths = {"user", "community"})
  List<BannedUser> findAllWithUserAndCommunityByKey_CommunityId(Long communityId);
}
