package com.ws.yay_backend.entity.embedded;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import java.io.Serializable;
import java.util.Objects;

@Embeddable
public class ChannelPermissionKey implements Serializable {
  @Column(name = "channel_id")
  private Long channelId;

  @Column(name = "role_id")
  private Long roleId;

  public ChannelPermissionKey() {}

  public ChannelPermissionKey(Long channelId, Long roleId) {
    this.channelId = channelId;
    this.roleId = roleId;
  }

  public Long getChannelId() {
    return channelId;
  }

  public void setChannelId(Long channelId) {
    this.channelId = channelId;
  }

  public Long getRoleId() {
    return roleId;
  }

  public void setRoleId(Long roleId) {
    this.roleId = roleId;
  }

  @Override
  public boolean equals(Object o) {
    if (this == o) return true;
    if (o == null || getClass() != o.getClass()) return false;
    ChannelPermissionKey that = (ChannelPermissionKey) o;
    return Objects.equals(channelId, that.channelId) && Objects.equals(roleId, that.roleId);
  }

  @Override
  public int hashCode() {
    return Objects.hash(channelId, roleId);
  }
}
