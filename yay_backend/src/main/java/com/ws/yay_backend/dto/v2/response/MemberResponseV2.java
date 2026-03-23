package com.ws.yay_backend.dto.v2.response;

import com.ws.yay_backend.entity.CommunityMember;
import jakarta.validation.constraints.NotNull;

public record MemberResponseV2(
    @NotNull long userId, @NotNull long communityId, @NotNull long roleId) {
  public static MemberResponseV2 fromEntity(CommunityMember member) {
    return new MemberResponseV2(
        member.getUser().getId(), member.getCommunity().getId(), member.getRole().getId());
  }
}
