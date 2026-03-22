package com.ws.yay_backend.dao;

import com.ws.yay_backend.entity.ChannelPermission;
import com.ws.yay_backend.entity.embedded.ChannelPermissionKey;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ChannelPermissionRepository
    extends JpaRepository<ChannelPermission, ChannelPermissionKey> {
  List<ChannelPermission> findByKey_ChannelId(long channelId);
}
