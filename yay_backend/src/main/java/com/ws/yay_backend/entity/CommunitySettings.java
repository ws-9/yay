package com.ws.yay_backend.entity;

import com.fasterxml.jackson.annotation.JsonAutoDetect;
import com.fasterxml.jackson.annotation.JsonInclude;

import java.io.Serializable;

@JsonInclude(JsonInclude.Include.NON_NULL) // otherwise all fields will default to null
@JsonAutoDetect(
    fieldVisibility = JsonAutoDetect.Visibility.ANY, // jackson uses private fields
    getterVisibility = JsonAutoDetect.Visibility.NONE,
    isGetterVisibility = JsonAutoDetect.Visibility.NONE
)
public class CommunitySettings implements Serializable {
  private static final boolean DEFAULT_IS_PRIVATE = false;

  private Boolean isPrivate;

  public CommunitySettings() {}

  public CommunitySettings(Boolean isPrivate) { // null resets the override
    this.isPrivate = isPrivate;
  }

  public boolean getIsPrivate() {
    return isPrivate != null ? isPrivate : DEFAULT_IS_PRIVATE;
  }

  public void setIsPrivate(boolean isPrivate) {
    this.isPrivate = isPrivate;
  }
}