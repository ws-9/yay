package com.ws.yay_backend.dao;

import com.ws.yay_backend.entity.Community;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface CommunityRepository extends JpaRepository<Community, Long> {
  boolean existsByIdAndOwner_Id(Long id, Long ownerId);

  // findById with a different name convention for eager loading
  @EntityGraph(attributePaths = {"members"})
  Optional<Community> findWithMembersById(Long id);

  boolean existsByIdAndMembers_Id(Long communityId, Long userId);

  // nativeQuery = true as the join table isn't an entity.
  @Modifying
  @Query(value = "DELETE FROM community_members WHERE community_id = :communityId AND user_id = :userId", nativeQuery = true)
  int deleteMember(@Param("communityId") Long communityId, @Param("userId") Long userId);

  List<Community> findByMembers_id(Long memberId);
}
