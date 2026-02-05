package com.ws.yay_backend.entity.embedded;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;

import java.util.Objects;

@Embeddable
public class BannedUserKey {
  @Column(name = "community_id")
  private Long communityId;
  
  @Column(name = "user_id")
  private Long userId;

  public BannedUserKey() {}

  public BannedUserKey(Long communityId, Long userId) {
    this.communityId = communityId;
    this.userId = userId;
  }

  public Long getCommunityId() {
    return communityId;
  }

  public void setCommunityId(Long communityId) {
    this.communityId = communityId;
  }

  public Long getUserId() {
    return userId;
  }

  public void setUserId(Long userId) {
    this.userId = userId;
  }

  @Override
  public boolean equals(Object o) {
    if (o == null || getClass() != o.getClass()) return false;
    BannedUserKey that = (BannedUserKey) o;
    return Objects.equals(communityId, that.communityId) && Objects.equals(userId, that.userId);
  }

  @Override
  public int hashCode() {
    return Objects.hash(communityId, userId);
  }
}