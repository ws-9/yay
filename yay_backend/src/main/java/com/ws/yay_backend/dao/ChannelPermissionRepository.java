package com.ws.yay_backend.dao;

import com.ws.yay_backend.entity.ChannelPermission;
import com.ws.yay_backend.entity.embedded.ChannelPermissionKey;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface ChannelPermissionRepository
    extends JpaRepository<ChannelPermission, ChannelPermissionKey> {
  List<ChannelPermission> findByKey_ChannelId(long channelId);

  @Query(
      "SELECT cp FROM ChannelPermission cp JOIN CommunityMember cm ON cp.channel.community.id = cm.community.id WHERE cp.channel.community.id IN :communityIds AND cm.user.id = :userId")
  List<ChannelPermission> findPermissionsByCommunityIdsAndUserId(
      List<Long> communityIds, Long userId);
}
