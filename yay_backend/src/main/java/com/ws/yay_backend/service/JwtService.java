package com.ws.yay_backend.service;

import org.springframework.security.core.userdetails.UserDetails;

import java.util.Map;

public interface JwtService {
  String extractUsername(String token);

  boolean isTokenValid(String token, UserDetails userDetails);

  String generateAccessToken(Map<String, Object> claims, UserDetails userDetails);

  String generateRefreshToken(Map<String, Object> claims, UserDetails userDetails);
}
