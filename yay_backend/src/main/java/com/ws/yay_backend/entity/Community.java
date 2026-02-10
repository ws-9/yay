package com.ws.yay_backend.entity;

import io.hypersistence.utils.hibernate.type.json.JsonBinaryType;
import jakarta.persistence.*;
import org.hibernate.annotations.Generated;
import org.hibernate.annotations.Type;
import org.hibernate.generator.EventType;

import java.util.Set;

@Entity
@Table(name = "communities")
public class Community {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "id")
  private Long id;

  @Column(name = "name", length = 50, nullable = false)
  private String name;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "owner_id", nullable = false)
  private User owner;

  @OneToMany(mappedBy = "community", cascade = CascadeType.REMOVE, orphanRemoval = true, fetch = FetchType.LAZY)
  private Set<CommunityMember> members;

  @Type(JsonBinaryType.class)
  @Column(name = "settings", columnDefinition = "jsonb", nullable = false)
  private CommunitySettings settings;

  @Generated(event = EventType.INSERT)
  @Column(name = "invite_slug", insertable = false, updatable = false, nullable = false)
  private String inviteSlug;

  public Community() {
    this.settings = new CommunitySettings();
  }

  public Community(String name, User owner) {
    this.name = name;
    this.owner = owner;
    this.settings = new CommunitySettings();
  }

  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }

  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }

  public User getOwner() {
    return owner;
  }

  public void setOwner(User owner) {
    this.owner = owner;
  }

  public Set<CommunityMember> getMembers() {
    return members;
  }

  public void setMembers(Set<CommunityMember> members) {
    this.members = members;
  }

  public CommunitySettings getSettings() {
    return settings;
  }

  public void setSettings(CommunitySettings settings) {
    this.settings = settings;
  }

  public String getInviteSlug() {
    return inviteSlug;
  }

  public void setInviteSlug(String inviteSlug) {
    this.inviteSlug = inviteSlug;
  }
}
