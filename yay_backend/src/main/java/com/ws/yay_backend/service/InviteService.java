package com.ws.yay_backend.service;

import com.ws.yay_backend.dto.response.InviteResponse;

public interface InviteService {
  InviteResponse getInvite(long communityId);
}
