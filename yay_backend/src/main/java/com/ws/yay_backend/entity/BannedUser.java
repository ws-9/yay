package com.ws.yay_backend.entity;

import com.ws.yay_backend.entity.embedded.BannedUserKey;
import jakarta.persistence.*;

@Entity
@Table(name = "banned_users")
public class BannedUser {
  @EmbeddedId
  private BannedUserKey key;

  @ManyToOne(fetch = FetchType.LAZY)
  @MapsId("communityId")
  @JoinColumn(name = "community_id", nullable = false)
  private Community community;

  @ManyToOne(fetch = FetchType.LAZY)
  @MapsId("userId")
  @JoinColumn(name = "user_id", nullable = false)
  private User user;

  public BannedUser() {}

  public BannedUser(Community community, User user) {
    this.key = new BannedUserKey(community.getId(), user.getId());
    this.community = community;
    this.user = user;
  }

  public BannedUserKey getKey() {
    return key;
  }

  public void setKey(BannedUserKey key) {
    this.key = key;
  }

  public Community getCommunity() {
    return community;
  }

  public void setCommunity(Community community) {
    this.community = community;
  }

  public User getUser() {
    return user;
  }

  public void setUser(User user) {
    this.user = user;
  }
}