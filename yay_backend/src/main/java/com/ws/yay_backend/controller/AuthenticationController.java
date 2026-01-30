package com.ws.yay_backend.controller;

import com.ws.yay_backend.dto.request.AuthenticationRequest;
import com.ws.yay_backend.dto.request.RegisterRequest;
import com.ws.yay_backend.dto.response.AuthenticationResponse;
import com.ws.yay_backend.service.AuthenticationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@Tag(name = "Authentication Controller")
@RestController
@RequestMapping("/api/auth")
public class AuthenticationController {
  private final AuthenticationService authenticationService;

  @Autowired
  public AuthenticationController(AuthenticationService authenticationService) {
    this.authenticationService = authenticationService;
  }

  @Operation(summary = "Create a new user account")
  @PostMapping("/register")
  @ResponseStatus(HttpStatus.CREATED)
  public void register(@RequestBody @Valid RegisterRequest request) throws Exception {
    authenticationService.register(request);
  }

  @Operation(summary = "Retrieve access token and user info")
  @PostMapping("/login")
  @ResponseStatus(HttpStatus.OK)
  public AuthenticationResponse login(@RequestBody @Valid AuthenticationRequest request, HttpServletResponse response) {
    return authenticationService.login(request, response);
  }

  @Operation(summary = "Refresh access token using refresh token cookie")
  @PostMapping("/refresh")
  @ResponseStatus(HttpStatus.OK)
  public AuthenticationResponse refresh(HttpServletRequest request, HttpServletResponse response) {
    return authenticationService.refresh(request, response);
  }

  @Operation(summary = "Logout and clear refresh token cookie")
  @PostMapping("/logout")
  @ResponseStatus(HttpStatus.OK)
  public void logout(HttpServletResponse response) {
    authenticationService.logout(response);
  }
}
