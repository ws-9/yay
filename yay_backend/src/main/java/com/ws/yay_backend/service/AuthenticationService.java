package com.ws.yay_backend.service;

import com.ws.yay_backend.dto.request.AuthenticationRequest;
import com.ws.yay_backend.dto.request.RegisterRequest;
import com.ws.yay_backend.dto.response.AuthenticationResponse;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

public interface AuthenticationService {
  void register(RegisterRequest registerRequest) throws Exception;

  AuthenticationResponse login(AuthenticationRequest authenticationRequest, HttpServletResponse response);

  AuthenticationResponse refresh(HttpServletRequest request, HttpServletResponse response);

  void logout(HttpServletResponse response);
}
