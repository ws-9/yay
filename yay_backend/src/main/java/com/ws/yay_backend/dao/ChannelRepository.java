package com.ws.yay_backend.dao;

import com.ws.yay_backend.entity.Channel;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ChannelRepository extends JpaRepository<Channel, Long> {
}
