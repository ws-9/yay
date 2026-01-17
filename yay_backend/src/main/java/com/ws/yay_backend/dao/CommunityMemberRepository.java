package com.ws.yay_backend.dao;

import com.ws.yay_backend.entity.CommunityMember;
import com.ws.yay_backend.entity.embedded.CommunityMemberKey;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CommunityMemberRepository extends JpaRepository<CommunityMember, CommunityMemberKey> {
  boolean existsByKey_CommunityIdAndKey_UserId(Long communityId, Long userId);
}
