package com.ws.yay_backend.service;

import com.ws.yay_backend.dto.v2.response.InviteResponseV2;

public interface InviteService {
  InviteResponseV2 getInvite(long communityId);
}
