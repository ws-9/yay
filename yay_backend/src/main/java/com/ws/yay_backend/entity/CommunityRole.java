package com.ws.yay_backend.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "community_roles")
public class CommunityRole {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(name = "name")
  private String name;

  @Column(name = "hierarchy_level")
  private Integer hierarchyLevel;

  @Column(name = "can_manage_channels")
  private Boolean canManageChannels;

  @Column(name = "can_ban_users")
  private Boolean canBanUsers;

  @Column(name = "can_manage_roles")
  private Boolean canManageRoles;

  @Column(name = "can_delete_messages")
  private Boolean canDeleteMessages;

  @Column(name = "can_manage_community_settings")
  private Boolean canManageCommunitySettings;

  public CommunityRole() {}

  public CommunityRole(String name, Integer hierarchyLevel, Boolean canManageChannels, Boolean canBanUsers, Boolean canManageRoles, Boolean canDeleteMessages, Boolean canManageCommunitySettings) {
    this.name = name;
    this.hierarchyLevel = hierarchyLevel;
    this.canManageChannels = canManageChannels;
    this.canBanUsers = canBanUsers;
    this.canManageRoles = canManageRoles;
    this.canDeleteMessages = canDeleteMessages;
    this.canManageCommunitySettings = canManageCommunitySettings;
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

  public Integer getHierarchyLevel() {
    return hierarchyLevel;
  }

  public void setHierarchyLevel(Integer hierarchyLevel) {
    this.hierarchyLevel = hierarchyLevel;
  }

  public Boolean getCanManageChannels() {
    return canManageChannels;
  }

  public void setCanManageChannels(Boolean canManageChannels) {
    this.canManageChannels = canManageChannels;
  }

  public Boolean getCanBanUsers() {
    return canBanUsers;
  }

  public void setCanBanUsers(Boolean canBanUsers) {
    this.canBanUsers = canBanUsers;
  }

  public Boolean getCanManageRoles() {
    return canManageRoles;
  }

  public void setCanManageRoles(Boolean canManageRoles) {
    this.canManageRoles = canManageRoles;
  }

  public Boolean getCanDeleteMessages() {
    return canDeleteMessages;
  }

  public void setCanDeleteMessages(Boolean canDeleteMessages) {
    this.canDeleteMessages = canDeleteMessages;
  }

  public Boolean getCanManageCommunitySettings() {
    return canManageCommunitySettings;
  }

  public void setCanManageCommunitySettings(Boolean canManageCommunitySettings) {
    this.canManageCommunitySettings = canManageCommunitySettings;
  }
}