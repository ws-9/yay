package com.ws.yay_backend.dao;

import com.ws.yay_backend.entity.Community;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CommunityRepository extends JpaRepository<Community, Long> {
  // Eagerly load owners
  @Override
  @EntityGraph(attributePaths = {"owner"})
  List<Community> findAll();

  boolean existsByIdAndOwner_Id(Long id, Long ownerId);

  // findById with a different name convention for eager loading
  @EntityGraph(attributePaths = {"members"})
  Optional<Community> findWithMembersById(Long id);

  boolean existsByIdAndMembers_Id(Long communityId, Long userId);
}
