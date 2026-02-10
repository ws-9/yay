package com.ws.yay_backend.dao;

import com.ws.yay_backend.entity.ChannelPermission;
import com.ws.yay_backend.entity.embedded.ChannelPermissionKey;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ChannelPermissionRepository extends JpaRepository<ChannelPermission, ChannelPermissionKey> {
  List<ChannelPermission> findByKey_ChannelId(long channelId);
}
