package com.ws.yay_backend.entity;

import com.ws.yay_backend.entity.embedded.CommunityMemberKey;
import jakarta.persistence.*;

@Entity
@Table(name = "community_members")
public class CommunityMember {
  @EmbeddedId
  private CommunityMemberKey key;

  @ManyToOne(fetch = FetchType.LAZY)
  @MapsId("communityId")
  @JoinColumn(name = "community_id", nullable = false)
  private Community community;

  @ManyToOne(fetch = FetchType.LAZY)
  @MapsId("userId")
  @JoinColumn(name = "user_id", nullable = false)
  private User user;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "role_id", nullable = false)
  private CommunityRole role;

  public CommunityMember() {}

  public CommunityMember(Community community, User user, CommunityRole role) {
    this.key = new CommunityMemberKey(community.getId(), user.getId());
    this.community = community;
    this.user = user;
    this.role = role;
  }

  public CommunityMemberKey getKey() {
    return key;
  }

  public void setKey(CommunityMemberKey key) {
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

  public CommunityRole getRole() {
    return role;
  }

  public void setRole(CommunityRole role) {
    this.role = role;
  }
}