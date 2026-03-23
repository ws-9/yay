package com.ws.yay_backend.service;

import com.ws.yay_backend.dto.request.CreateMessageRequest;
import com.ws.yay_backend.dto.request.UpdateMessageRequest;
import com.ws.yay_backend.dto.response.CursorPaginatedResponse;
import com.ws.yay_backend.dto.response.MessageResponse;
import java.time.Instant;

public interface ChannelMessageService {

  MessageResponse createMessage(CreateMessageRequest request);

  MessageResponse updateMessage(long id, UpdateMessageRequest request);

  void deleteMessage(long id);

  MessageResponse getMessage(long id);

  CursorPaginatedResponse<MessageResponse> getCursorPaginatedMessages(
      long channelId, int size, Instant cursor, Long cursorId);
}
