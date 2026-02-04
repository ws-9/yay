package com.ws.yay_backend.dao;

import com.ws.yay_backend.entity.CommunityMember;
import com.ws.yay_backend.entity.embedded.CommunityMemberKey;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CommunityMemberRepository extends JpaRepository<CommunityMember, CommunityMemberKey> {
  @EntityGraph(attributePaths = {"role"})
  Optional<CommunityMember> findWithRoleByKey(CommunityMemberKey key);

  @EntityGraph(attributePaths = {"user"})
  Optional<CommunityMember> findWithUserByKey(CommunityMemberKey key);

  @EntityGraph(attributePaths = {"role", "community"})
  Optional<CommunityMember> findWithRoleAndCommunityByKey(CommunityMemberKey key);

  @EntityGraph(attributePaths = {"role", "community", "community.owner"})
  Optional<CommunityMember> findWithRoleAndCommunityAndOwnerByKey(CommunityMemberKey key);

  @EntityGraph(attributePaths = {"user", "role", "community", "community.owner"})
  Optional<CommunityMember> findWithUserAndRoleAndCommunityAndOwnerByKey(CommunityMemberKey key);
  
  @EntityGraph(attributePaths = {"user", "role"})
  List<CommunityMember> findAllWithUserAndRoleByKey_CommunityId(Long communityId);

  @EntityGraph(attributePaths = {"role"})
  List<CommunityMember> findAllWithRoleByKey_UserIdAndKey_CommunityIdIn(Long userId, List<Long> communityIds);

  @EntityGraph(attributePaths = {"role"})
  List<CommunityMember> findAllWithRoleByKey_CommunityIdAndKey_UserIdIn(Long communityId, List<Long> userIds);
}
