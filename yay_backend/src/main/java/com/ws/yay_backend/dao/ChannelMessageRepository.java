package com.ws.yay_backend.dao;

import com.ws.yay_backend.entity.ChannelMessage;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

public interface ChannelMessageRepository extends JpaRepository<ChannelMessage, Long> {
  @EntityGraph(attributePaths = {"user", "channel", "channel.community"})
  Optional<ChannelMessage> findWithUserAndChannelById(Long id);

  // Initial load wo cursor
  @EntityGraph(attributePaths = {"user", "channel"})
  List<ChannelMessage> findByChannel_IdOrderByCreatedAtDescIdDesc(long channelId, Pageable pageable);

  // With cursor
  @Query("""
      SELECT m FROM ChannelMessage m
      WHERE m.channel.id = :channelId
        AND (m.createdAt < :cursor OR (m.createdAt = :cursor AND m.id < :cursorId))
      ORDER BY m.createdAt DESC, m.id DESC
  """)
  @EntityGraph(attributePaths = {"user", "channel"})
  List<ChannelMessage> findMessagesBeforeCursor(
      @Param("channelId") long channelId,
      @Param("cursor") Instant cursor,
      @Param("cursorId") Long cursorId,
      Pageable pageable
  );
}
