package com.ws.yay_backend.service;

import com.ws.yay_backend.components.AuthUtilsComponent;
import com.ws.yay_backend.dao.ChannelMessageRepository;
import com.ws.yay_backend.dao.ChannelRepository;
import com.ws.yay_backend.dao.CommunityMemberRepository;
import com.ws.yay_backend.dto.broadcast.ChannelMessageBroadcast;
import com.ws.yay_backend.dto.request.CreateMessageRequest;
import com.ws.yay_backend.dto.request.UpdateMessageRequest;
import com.ws.yay_backend.dto.response.CursorPaginatedResponse;
import com.ws.yay_backend.dto.response.MessageResponse;
import com.ws.yay_backend.entity.Channel;
import com.ws.yay_backend.entity.ChannelMessage;
import com.ws.yay_backend.entity.CommunityMember;
import com.ws.yay_backend.entity.CommunityRole;
import com.ws.yay_backend.entity.User;
import com.ws.yay_backend.entity.embedded.CommunityMemberKey;
import java.time.Instant;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
public class ChannelMessageServiceImpl implements ChannelMessageService {
  private final ChannelMessageRepository channelMessageRepository;
  private final ChannelRepository channelRepository;
  private final CommunityMemberRepository communityMemberRepository;
  private final AuthUtilsComponent authUtilsComponent;
  private final SimpMessagingTemplate simpMessagingTemplate;

  @Autowired
  public ChannelMessageServiceImpl(
      ChannelMessageRepository channelMessageRepository,
      ChannelRepository channelRepository,
      CommunityMemberRepository communityMemberRepository,
      AuthUtilsComponent authUtilsComponent,
      SimpMessagingTemplate simpMessagingTemplate) {
    this.channelMessageRepository = channelMessageRepository;
    this.channelRepository = channelRepository;
    this.communityMemberRepository = communityMemberRepository;
    this.authUtilsComponent = authUtilsComponent;
    this.simpMessagingTemplate = simpMessagingTemplate;
  }

  @Override
  @Transactional
  public MessageResponse createMessage(CreateMessageRequest request) {
    User user = authUtilsComponent.getAuthenticatedUser();

    Channel channel =
        channelRepository
            .findWithCommunityById(request.channelId())
            .orElseThrow(
                () ->
                    new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Channel not found: " + request.channelId()));

    boolean isMember =
        communityMemberRepository.existsById(
            new CommunityMemberKey(channel.getCommunity().getId(), user.getId()));

    if (!isMember) {
      throw new ResponseStatusException(
          HttpStatus.NOT_FOUND, "Channel not found: " + request.channelId());
    }

    ChannelMessage channelMessage = new ChannelMessage(request.message(), user, channel);
    ChannelMessage saved = channelMessageRepository.save(channelMessage);

    MessageResponse response = MessageResponse.fromEntity(saved);

    ChannelMessageBroadcast broadcast = ChannelMessageBroadcast.fromEntity(saved);
    simpMessagingTemplate.convertAndSend("/topic/channel/" + response.channelId(), broadcast);

    return response;
  }

  @Override
  @Transactional
  public MessageResponse updateMessage(long id, UpdateMessageRequest request) {
    Long userId = authUtilsComponent.getAuthenticatedUserId();

    ChannelMessage channelMessage =
        channelMessageRepository
            .findWithUserAndChannelById(id)
            .orElseThrow(
                () -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Message not found"));

    if (!channelMessage.getUser().getId().equals(userId)) {
      throw new ResponseStatusException(
          HttpStatus.FORBIDDEN, "You don't have permission to edit this message");
    }

    channelMessage.setMessage(request.message());
    channelMessage.setUpdatedAt(Instant.now());

    MessageResponse response = MessageResponse.fromEntity(channelMessage);

    ChannelMessageBroadcast broadcast = ChannelMessageBroadcast.fromEntity(channelMessage);
    simpMessagingTemplate.convertAndSend("/topic/channel/" + response.channelId(), broadcast);

    return response;
  }

  @Override
  @Transactional
  public void deleteMessage(long id) {
    Long userId = authUtilsComponent.getAuthenticatedUserId();

    ChannelMessage channelMessage =
        channelMessageRepository
            .findWithUserAndChannelAndCommunityById(id)
            .orElseThrow(
                () -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Message not found"));

    boolean isAuthor = channelMessage.getUser().getId().equals(userId);

    if (isAuthor) {
      channelMessage.setDeletedAt(Instant.now());
    } else {
      Long communityId = channelMessage.getChannel().getCommunity().getId();

      CommunityMember currentUserMember =
          communityMemberRepository
              .findWithRoleByKey(new CommunityMemberKey(communityId, userId))
              .orElseThrow(
                  () ->
                      new ResponseStatusException(
                          HttpStatus.FORBIDDEN, "You are not a member of this community"));

      CommunityMember authorMember =
          communityMemberRepository
              .findWithRoleByKey(
                  new CommunityMemberKey(communityId, channelMessage.getUser().getId()))
              .orElse(null);

      CommunityRole currentUserRole = currentUserMember.getRole();

      if (!currentUserRole.getCanDeleteMessages()) {
        throw new ResponseStatusException(
            HttpStatus.FORBIDDEN, "You don't have permission to delete messages");
      }

      if (authorMember != null) {
        CommunityRole authorRole = authorMember.getRole();
        if (currentUserRole.getHierarchyLevel() >= authorRole.getHierarchyLevel()) {
          throw new ResponseStatusException(
              HttpStatus.FORBIDDEN,
              "You cannot delete messages from users with equal or higher authority");
        }
      }

      channelMessage.setDeletedAt(Instant.now());
    }

    ChannelMessageBroadcast broadcast = ChannelMessageBroadcast.fromEntity(channelMessage);
    simpMessagingTemplate.convertAndSend(
        "/topic/channel/" + channelMessage.getChannel().getId(), broadcast);
  }

  @Override
  @Transactional(readOnly = true)
  public MessageResponse getMessage(long id) {
    Long userId = authUtilsComponent.getAuthenticatedUserId();

    ChannelMessage channelMessage =
        channelMessageRepository
            .findWithUserAndChannelAndCommunityById(id)
            .orElseThrow(
                () -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Message not found"));

    boolean isMember =
        communityMemberRepository.existsById(
            new CommunityMemberKey(channelMessage.getChannel().getCommunity().getId(), userId));

    if (!isMember) {
      throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Message not found");
    }

    return MessageResponse.fromEntity(channelMessage);
  }

  @Override
  @Transactional(readOnly = true)
  public CursorPaginatedResponse<MessageResponse> getCursorPaginatedMessages(
      long channelId, int size, Instant cursor, Long cursorId) {
    Long userId = authUtilsComponent.getAuthenticatedUserId();
    Pageable pageable = PageRequest.of(0, size + 1);

    List<ChannelMessage> messages =
        cursor != null
            ? channelMessageRepository.findMessagesByChannelIdAndUserIdBeforeCursor(
                channelId, userId, cursor, cursorId, pageable)
            : channelMessageRepository.findMessagesByChannelIdAndUserId(
                channelId, userId, pageable);

    boolean hasNext = messages.size() > size;

    if (hasNext) {
      messages = messages.subList(0, size);
    }

    List<MessageResponse> responseList =
        messages.stream().map(MessageResponse::fromEntity).toList();

    Instant nextCursor = messages.isEmpty() ? null : messages.getLast().getCreatedAt();
    Long nextCursorId = messages.isEmpty() ? null : messages.getLast().getId();

    return new CursorPaginatedResponse<>(responseList, nextCursor, nextCursorId, hasNext);
  }
}
