package com.ws.yay_backend.dao;

import com.ws.yay_backend.entity.Channel;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ChannelRepository extends JpaRepository<Channel, Long> {
  List<Channel> findAllByCommunity_Id(Long communityId);
}
