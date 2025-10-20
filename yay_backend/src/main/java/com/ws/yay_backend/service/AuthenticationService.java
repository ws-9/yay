package com.ws.yay_backend.service;

import com.ws.yay_backend.request.AuthenticationRequest;
import com.ws.yay_backend.request.RegisterRequest;
import com.ws.yay_backend.response.AuthenticationResponse;

public interface AuthenticationService {
  void register(RegisterRequest registerRequest) throws Exception;

  AuthenticationResponse login(AuthenticationRequest authenticationRequest);
}
