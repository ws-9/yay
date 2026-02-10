package com.ws.yay_backend.entity;

import com.ws.yay_backend.entity.embedded.ChannelPermissionKey;
import jakarta.persistence.*;

@Entity
@Table(name = "channel_permissions")
public class ChannelPermission {
  @EmbeddedId
  private ChannelPermissionKey key;

  @ManyToOne(fetch = FetchType.LAZY)
  @MapsId("channelId")
  private Channel channel;

  @ManyToOne(fetch = FetchType.LAZY)
  @MapsId("roleId")
  private CommunityRole role;

  @Column(name = "can_read", nullable = false)
  private Boolean canRead;

  @Column(name = "can_write", nullable = false)
  private Boolean canWrite;

  // if you can write, you must be able to read
  @PrePersist
  @PreUpdate
  private void enforcePermissionRules() {
    if (Boolean.TRUE.equals(canWrite) && Boolean.FALSE.equals(canRead)) {
      this.canRead = true;
    }
  }

  public boolean isDefault() {
    return Boolean.TRUE.equals(canRead) && Boolean.TRUE.equals(canWrite);
  }

  public static ChannelPermission createDefault(Channel channel, CommunityRole role) {
    return new ChannelPermission(channel, role, true, true);
  }

  public ChannelPermission() {}

  public ChannelPermission(Channel channel, CommunityRole role, Boolean canRead, Boolean canWrite) {
    this.key = new ChannelPermissionKey(channel.getId(), role.getId());
    this.channel = channel;
    this.role = role;
    this.canRead = canRead != null ? canRead : true;
    this.canWrite = canWrite != null ? canWrite : true;
  }

  public ChannelPermissionKey getKey() {
    return key;
  }

  public void setKey(ChannelPermissionKey key) {
    this.key = key;
  }

  public Channel getChannel() {
    return channel;
  }

  public void setChannel(Channel channel) {
    this.channel = channel;
  }

  public CommunityRole getRole() {
    return role;
  }

  public void setRole(CommunityRole role) {
    this.role = role;
  }

  public Boolean getCanRead() {
    return canRead;
  }

  public void setCanRead(Boolean canRead) {
    this.canRead = canRead;
  }

  public Boolean getCanWrite() {
    return canWrite;
  }

  public void setCanWrite(Boolean canWrite) {
    this.canWrite = canWrite;
  }
}
