package com.ws.yay_backend.service;

import com.ws.yay_backend.dto.request.AuthenticationRequest;
import com.ws.yay_backend.dto.request.RegisterRequest;
import com.ws.yay_backend.dto.response.AuthenticationResponse;

public interface AuthenticationService {
  void register(RegisterRequest registerRequest) throws Exception;

  AuthenticationResponse login(AuthenticationRequest authenticationRequest);
}
