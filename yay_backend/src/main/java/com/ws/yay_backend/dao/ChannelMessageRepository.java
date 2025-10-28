package com.ws.yay_backend.dao;

import com.ws.yay_backend.entity.ChannelMessage;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ChannelMessageRepository extends JpaRepository<ChannelMessage, Long> {
}
