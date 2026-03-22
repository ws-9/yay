package com.ws.yay_backend.service;

import com.ws.yay_backend.dto.v1.request.CreateChannelMessageRequest;
import com.ws.yay_backend.dto.v1.request.DeleteChannelMessageRequest;
import com.ws.yay_backend.dto.v1.request.EditChannelMessageRequest;
import com.ws.yay_backend.dto.v1.response.CursorPaginatedResponse;
import com.ws.yay_backend.dto.v1.response.GetChannelMessageResponse;
import java.time.Instant;

public interface ChannelMessageService {
  GetChannelMessageResponse createMessage(CreateChannelMessageRequest request);

  GetChannelMessageResponse editMessage(EditChannelMessageRequest request);

  GetChannelMessageResponse deleteMessage(DeleteChannelMessageRequest request);

  CursorPaginatedResponse<GetChannelMessageResponse> getCursorPaginatedMessages(
      long channelId, int size, Instant cursor, Long cursorId);
}
