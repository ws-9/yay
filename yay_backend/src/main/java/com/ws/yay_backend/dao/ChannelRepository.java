package com.ws.yay_backend.dao;

import com.ws.yay_backend.entity.Channel;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ChannelRepository extends JpaRepository<Channel, Long> {
  @EntityGraph(attributePaths = {"community"})
  List<Channel> findAllWithCommunityByCommunity_Id(Long communityId);

  // Does the channel exist and is the user a member of its community?
  boolean existsByIdAndCommunity_Members_User_Id(Long channelId, Long userId);

  boolean existsByNameAndCommunity_Id(String name, Long communityId);

  @EntityGraph(attributePaths = {"community"})
  List<Channel> findAllWithCommunityByCommunity_IdIn(List<Long> communityIds);
}
