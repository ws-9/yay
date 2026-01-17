package com.ws.yay_backend.entity;

public enum CommunityRoleName {
  ADMIN("Admin"),
  MODERATOR("Moderator"),
  MEMBER("Member");

  private final String value;

  CommunityRoleName(String value) {
    this.value = value;
  }

  public String getValue() {
    return value;
  }
}
