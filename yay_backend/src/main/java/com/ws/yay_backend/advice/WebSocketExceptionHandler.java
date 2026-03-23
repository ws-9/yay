package com.ws.yay_backend.advice;

import com.ws.yay_backend.dto.broadcast.SimpleErrorBroadcast;
import org.springframework.messaging.handler.annotation.MessageExceptionHandler;
import org.springframework.messaging.simp.annotation.SendToUser;
import org.springframework.web.bind.annotation.ControllerAdvice;

@ControllerAdvice
public class WebSocketExceptionHandler {
  @MessageExceptionHandler
  @SendToUser("/queue/errors")
  public SimpleErrorBroadcast handleGeneralWsException(RuntimeException e) {
    return new SimpleErrorBroadcast(e.getMessage());
  }
}
