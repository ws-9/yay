package com.ws.yay_backend.dao;

import com.ws.yay_backend.entity.Channel;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ChannelRepository extends JpaRepository<Channel, Long> {
  List<Channel> findAllByCommunity_Id(Long communityId);

  // Does the channel exist and is the user a member of its community?
  boolean existsByIdAndCommunity_Members_User_Id(Long channelId, Long userId);
  
  boolean existsByIdAndCommunity_Owner_Id(Long channelId, Long userId);

  @EntityGraph(attributePaths = {"community"})
  List<Channel> findAllByCommunity_IdIn(List<Long> communityIds);
}
