package com.ws.yay_backend.service;

import com.ws.yay_backend.dto.v1.request.CreateChannelMessageRequest;
import com.ws.yay_backend.dto.v1.request.DeleteChannelMessageRequest;
import com.ws.yay_backend.dto.v1.request.EditChannelMessageRequest;
import com.ws.yay_backend.dto.v1.response.CursorPaginatedResponse;
import com.ws.yay_backend.dto.v1.response.GetChannelMessageResponse;
import com.ws.yay_backend.dto.v2.request.CreateMessageRequestV2;
import com.ws.yay_backend.dto.v2.request.UpdateMessageRequestV2;
import com.ws.yay_backend.dto.v2.response.MessageResponseV2;
import java.time.Instant;

public interface ChannelMessageService {
  GetChannelMessageResponse createMessage(CreateChannelMessageRequest request);

  GetChannelMessageResponse editMessage(EditChannelMessageRequest request);

  GetChannelMessageResponse deleteMessage(DeleteChannelMessageRequest request);

  CursorPaginatedResponse<GetChannelMessageResponse> getCursorPaginatedMessages(
      long channelId, int size, Instant cursor, Long cursorId);

  // V2 Methods
  MessageResponseV2 createMessageV2(CreateMessageRequestV2 request);

  MessageResponseV2 updateMessageV2(long id, UpdateMessageRequestV2 request);

  void deleteMessageV2(long id);

  MessageResponseV2 getMessageV2(long id);

  CursorPaginatedResponse<MessageResponseV2> getCursorPaginatedMessagesV2(
      long channelId, int size, Instant cursor, Long cursorId);
}
