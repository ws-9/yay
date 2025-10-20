package com.ws.yay_backend.controller;

import com.ws.yay_backend.request.AuthenticationRequest;
import com.ws.yay_backend.request.RegisterRequest;
import com.ws.yay_backend.response.AuthenticationResponse;
import com.ws.yay_backend.service.AuthenticationService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthenticationController {
  private final AuthenticationService authenticationService;

  @Autowired
  public AuthenticationController(AuthenticationService authenticationService) {
    this.authenticationService = authenticationService;
  }

  @PostMapping("/register")
  @ResponseStatus(HttpStatus.CREATED)
  void register(@RequestBody @Valid RegisterRequest request) throws Exception {
    authenticationService.register(request);
  }

  @PostMapping("/login")
  @ResponseStatus(HttpStatus.OK)
  public AuthenticationResponse login(@RequestBody @Valid AuthenticationRequest request) {
    return authenticationService.login(request);
  }
}
