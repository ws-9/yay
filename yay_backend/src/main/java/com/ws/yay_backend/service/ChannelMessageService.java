package com.ws.yay_backend.service;

import com.ws.yay_backend.dto.request.CreateMessageRequestV2;
import com.ws.yay_backend.dto.request.UpdateMessageRequestV2;
import com.ws.yay_backend.dto.response.CursorPaginatedResponse;
import com.ws.yay_backend.dto.response.MessageResponseV2;
import java.time.Instant;

public interface ChannelMessageService {

  // V2 Methods
  MessageResponseV2 createMessageV2(CreateMessageRequestV2 request);

  MessageResponseV2 updateMessageV2(long id, UpdateMessageRequestV2 request);

  void deleteMessageV2(long id);

  MessageResponseV2 getMessageV2(long id);

  CursorPaginatedResponse<MessageResponseV2> getCursorPaginatedMessagesV2(
      long channelId, int size, Instant cursor, Long cursorId);
}
