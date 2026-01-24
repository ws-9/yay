package com.ws.yay_backend.service;

import com.ws.yay_backend.dto.request.CreateChannelMessageRequest;
import com.ws.yay_backend.dto.request.EditChannelMessageRequest;
import com.ws.yay_backend.dto.response.CursorPaginatedResponse;
import com.ws.yay_backend.dto.response.GetChannelMessageResponse;

import java.time.Instant;

public interface ChannelMessageService {
  GetChannelMessageResponse createMessage(CreateChannelMessageRequest request);

  GetChannelMessageResponse editMessage(EditChannelMessageRequest request);

  CursorPaginatedResponse<GetChannelMessageResponse> getCursorPaginatedMessages(long channelId, int size, Instant cursor, Long cursorId);
}
