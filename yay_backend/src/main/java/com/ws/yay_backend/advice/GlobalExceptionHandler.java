package com.ws.yay_backend.advice;

import com.ws.yay_backend.response.SimpleErrorResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.server.ResponseStatusException;

import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {
  @ExceptionHandler(ResponseStatusException.class)
  public ResponseEntity<SimpleErrorResponse> handleUsernameNotFoundException(ResponseStatusException e) {
    return ResponseEntity
        .status(e.getStatusCode())
        .body(new SimpleErrorResponse(e.getReason()));
  }
}
