package com.ws.yay_backend.dto.response;

import com.ws.yay_backend.entity.CommunityMember;
import jakarta.validation.constraints.NotNull;

public record MemberResponse(
    @NotNull long userId, @NotNull long communityId, @NotNull long roleId) {
  public static MemberResponse fromEntity(CommunityMember member) {
    return new MemberResponse(
        member.getUser().getId(), member.getCommunity().getId(), member.getRole().getId());
  }
}
