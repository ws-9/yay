package com.ws.yay_backend.service;

import com.ws.yay_backend.components.AuthUtilsComponent;
import com.ws.yay_backend.dao.ChannelMessageRepository;
import com.ws.yay_backend.dao.ChannelRepository;
import com.ws.yay_backend.dto.response.CursorPaginatedResponse;
import com.ws.yay_backend.entity.Channel;
import com.ws.yay_backend.entity.ChannelMessage;
import com.ws.yay_backend.entity.User;
import com.ws.yay_backend.dto.request.CreateChannelMessageRequest;
import com.ws.yay_backend.dto.response.GetChannelMessageResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.Instant;
import java.util.List;

@Service
public class ChannelMessageServiceImpl implements ChannelMessageService {
  private final ChannelMessageRepository channelMessageRepository;
  private final ChannelRepository channelRepository;
  private final AuthUtilsComponent authUtilsComponent;

  @Autowired
  public ChannelMessageServiceImpl(ChannelMessageRepository channelMessageRepository, ChannelRepository channelRepository, AuthUtilsComponent authUtilsComponent) {
    this.channelMessageRepository = channelMessageRepository;
    this.channelRepository = channelRepository;
    this.authUtilsComponent = authUtilsComponent;
  }

  @Override
  @Transactional
  @PreAuthorize("""
      hasRole('ADMIN') or
      @channelRepository.existsByIdAndCommunity_Members_User_Id(#request.channelId, authentication.principal.id) or
      @channelRepository.existsByIdAndCommunity_Owner_Id(#request.channelId, authentication.principal.id)
      """)
  public GetChannelMessageResponse createMessage(CreateChannelMessageRequest request) {
    User user = authUtilsComponent.getAuthenticatedUser();

    Channel channel = channelRepository.findById((request.channelId()))
        .orElseThrow(() -> new ResponseStatusException(
            HttpStatus.NOT_FOUND,
            "Channel not found: " + request.channelId()
        ));

    ChannelMessage channelMessage = new ChannelMessage(request.message(), user, channel);
    ChannelMessage saved = channelMessageRepository.save(channelMessage);

    return new GetChannelMessageResponse(saved);
  }

  @Override
  @Transactional(readOnly = true)
  public CursorPaginatedResponse<GetChannelMessageResponse> getCursorPaginatedMessages(
      long channelId,
      int size,
      Instant cursor,
      Long cursorId
  ) {
    Pageable pageable = PageRequest.of(0, size + 1);

    List<ChannelMessage> messages = cursor != null
        ? channelMessageRepository.findMessagesBeforeCursor(channelId, cursor, cursorId, pageable)
        : channelMessageRepository.findByChannel_IdOrderByCreatedAtDescIdDesc(channelId, pageable);

    boolean hasNext = messages.size() > size;

    if (hasNext) {
      messages = messages.subList(0, size);
    }

    List<GetChannelMessageResponse> responseList = messages.stream()
        .map(GetChannelMessageResponse::new).toList();

    Instant nextCursor = messages.isEmpty() ? null : messages.getLast().getCreatedAt();
    Long nextCursorId = messages.isEmpty() ? null : messages.getLast().getId();

    return new CursorPaginatedResponse<>(responseList, nextCursor, nextCursorId, hasNext);
  }
}
