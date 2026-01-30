package com.ws.yay_backend.service;

import com.ws.yay_backend.dao.RoleRepository;
import com.ws.yay_backend.dao.UserRepository;
import com.ws.yay_backend.entity.Role;
import com.ws.yay_backend.entity.User;
import com.ws.yay_backend.dto.request.AuthenticationRequest;
import com.ws.yay_backend.dto.request.RegisterRequest;
import com.ws.yay_backend.dto.response.AuthenticationResponse;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.Set;

@Service
public class AuthenticationServiceImpl implements AuthenticationService {
  private final UserRepository userRepository;
  private final RoleRepository roleRepository;
  private final AuthenticationManager authenticationManager;
  private final JwtService jwtService;

  @Value("${spring.refresh-token.expiration}")
  private long REFRESH_TOKEN_EXPIRATION_MS;

  @Autowired
  public AuthenticationServiceImpl(
      UserRepository userRepository,
      RoleRepository roleRepository,
      AuthenticationManager authenticationManager,
      JwtService jwtService
  ) {
    this.userRepository = userRepository;
    this.roleRepository = roleRepository;
    this.authenticationManager = authenticationManager;
    this.jwtService = jwtService;
  }

  @Override
  @Transactional
  public void register(RegisterRequest registerRequest) throws Exception {
    if (isUsernameTaken(registerRequest.username())) {
      throw new Exception("Username is already taken");
    }
    userRepository.save(createUserEntity(registerRequest));
  }

  @Override
  @Transactional(readOnly = true)
  public AuthenticationResponse login(AuthenticationRequest authenticationRequest, HttpServletResponse response) {
    authenticationManager.authenticate(
        new UsernamePasswordAuthenticationToken(
            authenticationRequest.username(), authenticationRequest.password()
        )
    );

    User user = userRepository.findByUsername(authenticationRequest.username())
        .orElseThrow(() -> new IllegalArgumentException("Invalid username or password"));


    String jwtToken = jwtService.generateAccessToken(new HashMap<>(), user);
    String refreshToken = jwtService.generateRefreshToken(new HashMap<>(), user);

    setRefreshTokenCookie(response, refreshToken);

    return new AuthenticationResponse(jwtToken);
  }

  private boolean isUsernameTaken(String username) {
    return userRepository.findByUsername(username).isPresent();
  }

  private User createUserEntity(RegisterRequest registerRequest) {
    String username = registerRequest.username();
    String password = registerRequest.username();

    Role defaultRole = roleRepository.findByName("ROLE_USER")
        .orElseThrow(() -> new RuntimeException("Default role not found"));

    return new User(
        username,
        "{noop}" + password,
        true,
        Set.of(defaultRole)
    );
  }

  private void setRefreshTokenCookie(HttpServletResponse response, String token) {
    Cookie cookie = new Cookie("refreshToken", token);
    cookie.setHttpOnly(true);
    cookie.setSecure(false); // set to true in production with HTTPS
    cookie.setPath("/");
    cookie.setMaxAge((int) (REFRESH_TOKEN_EXPIRATION_MS / 1000));
    response.addCookie(cookie);
  }

  private void clearRefreshTokenCookie(HttpServletResponse response) {
    Cookie cookie = new Cookie("refreshToken", null);
    cookie.setHttpOnly(true);
    cookie.setSecure(false);
    cookie.setPath("/");
    cookie.setMaxAge(0);
    response.addCookie(cookie);
  }

  @Override
  public AuthenticationResponse refresh(HttpServletRequest request, HttpServletResponse response) {
    Cookie[] cookies = request.getCookies();
    String refreshToken = null;
    if (cookies != null) {
      for (Cookie cookie : cookies) {
        if ("refreshToken".equals(cookie.getName())) {
          refreshToken = cookie.getValue();
          break;
        }
      }
    }

    if (refreshToken == null) {
      throw new IllegalArgumentException("Refresh token not found");
    }

    String username = jwtService.extractUsername(refreshToken);
    User user = userRepository.findByUsername(username)
        .orElseThrow(() -> new IllegalArgumentException("User not found"));

    if (!jwtService.isTokenValid(refreshToken, user)) {
      clearRefreshTokenCookie(response);
      throw new IllegalArgumentException("Invalid refresh token");
    }

    String newAccessToken = jwtService.generateAccessToken(new HashMap<>(), user);
    String newRefreshToken = jwtService.generateRefreshToken(new HashMap<>(), user);

    setRefreshTokenCookie(response, newRefreshToken);

    return new AuthenticationResponse(newAccessToken);
  }

  @Override
  public void logout(HttpServletResponse response) {
    clearRefreshTokenCookie(response);
  }
}
