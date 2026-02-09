package com.ws.yay_backend.dao;

import com.ws.yay_backend.entity.Community;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface CommunityRepository extends JpaRepository<Community, Long> {
  @Query("SELECT c FROM Community c JOIN FETCH c.owner")
  List<Community> findAllWithOwner();

  @EntityGraph(attributePaths = {"owner"})
  Optional<Community> findWithOwnerById(Long id);

  @EntityGraph(attributePaths = {"members", "members.user"})
  Optional<Community> findWithMembersAndUsersById(Long id);

  // Find all communities that the user is part of with owner
  @EntityGraph(attributePaths = {"owner"})
  List<Community> findAllWithOwnerByMembers_User_id(Long memberId);

  Optional<Community> findByInviteSlug(String inviteSlug);
}
