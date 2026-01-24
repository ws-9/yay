package com.ws.yay_backend.dao;

import com.ws.yay_backend.entity.Channel;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ChannelRepository extends JpaRepository<Channel, Long> {
  @EntityGraph(attributePaths = {"community"})
  List<Channel> findAllWithCommunityByCommunity_Id(Long communityId);

  boolean existsByNameAndCommunity_Id(String name, Long communityId);

  @EntityGraph(attributePaths = {"community"})
  List<Channel> findAllWithCommunityByCommunity_IdIn(List<Long> communityIds);

  @EntityGraph(attributePaths = {"community"})
  Optional<Channel> findWithCommunityById(Long id);
}
