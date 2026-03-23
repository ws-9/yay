package com.ws.yay_backend.dao;

import com.ws.yay_backend.entity.Channel;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface ChannelRepository extends JpaRepository<Channel, Long> {
  @EntityGraph(attributePaths = {"community"})
  List<Channel> findAllWithCommunityByCommunity_Id(Long communityId);

  boolean existsByNameAndCommunity_Id(String name, Long communityId);

  @EntityGraph(attributePaths = {"community"})
  List<Channel> findAllWithCommunityByCommunity_IdIn(List<Long> communityIds);

  @Query(
      "SELECT c FROM Channel c JOIN CommunityMember cm ON c.community.id = cm.community.id WHERE c.community.id IN :communityIds AND cm.user.id = :userId")
  @EntityGraph(attributePaths = {"community"})
  List<Channel> findChannelsByCommunityIdsAndUserId(List<Long> communityIds, Long userId);

  @EntityGraph(attributePaths = {"community"})
  Optional<Channel> findWithCommunityById(Long id);

  // return channels with given ids if the user is a member of their communities
  @Query(
      "SELECT c FROM Channel c JOIN CommunityMember cm ON c.community.id = cm.community.id WHERE c.id IN :ids AND cm.user.id = :userId")
  @EntityGraph(attributePaths = {"community"})
  List<Channel> findChannelsByIdsAndUserId(List<Long> ids, Long userId);
}
