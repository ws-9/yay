package com.ws.yay_backend.dao;

import com.ws.yay_backend.entity.ChannelMessage;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ChannelMessageRepository extends JpaRepository<ChannelMessage, Long> {
  List<ChannelMessage> findAllByChannel_Id(long channelId);
}
