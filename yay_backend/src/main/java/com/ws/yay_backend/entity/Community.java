package com.ws.yay_backend.entity;

import jakarta.persistence.*;

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

  @OneToMany(mappedBy = "community", fetch = FetchType.LAZY)
  private Set<CommunityMember> members;

  public Community() {}

  public Community(String name, User owner) {
    this.name = name;
    this.owner = owner;
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
}
