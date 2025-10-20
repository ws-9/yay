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

  @ManyToMany(fetch = FetchType.LAZY)
  @JoinTable(
      name = "community_members",
      joinColumns = @JoinColumn(name = "community_id"),
      inverseJoinColumns = @JoinColumn(name = "user_id")
  )
  private Set<User> members;

  public Community() {}

  public Community(String name, User owner) {
    this.name = name;
    this.owner = owner;
  }

  public Community(String name, User owner, Set<User> members) {
    this.name = name;
    this.owner = owner;
    this.members = members;
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

  public Set<User> getMembers() {
    return members;
  }

  public void setMembers(Set<User> members) {
    this.members = members;
  }
}
