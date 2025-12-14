package com.ws.yay_backend.advice;

import com.ws.yay_backend.dto.response.SimpleErrorResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.server.ResponseStatusException;

import java.util.ArrayList;
import java.util.List;

@RestControllerAdvice
public class RestExceptionHandler {
  @ExceptionHandler(ResponseStatusException.class)
  public ResponseEntity<SimpleErrorResponse> handleUsernameNotFoundException(ResponseStatusException e) {
    return ResponseEntity
        .status(e.getStatusCode())
        .body(new SimpleErrorResponse(e.getReason()));
  }

  @ExceptionHandler(MethodArgumentNotValidException.class)
  public ResponseEntity<List<SimpleErrorResponse>> handleValidationExceptions(MethodArgumentNotValidException ex) {
    List<SimpleErrorResponse> errors = new ArrayList<>();
    ex.getBindingResult().getFieldErrors()
        .forEach(error -> errors.add(new SimpleErrorResponse(error.getDefaultMessage())));

    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errors);
  }
}
