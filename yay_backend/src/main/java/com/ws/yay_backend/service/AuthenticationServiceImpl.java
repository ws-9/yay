package com.ws.yay_backend.service;

import com.ws.yay_backend.dao.RoleRepository;
import com.ws.yay_backend.dao.UserRepository;
import com.ws.yay_backend.entity.Role;
import com.ws.yay_backend.entity.User;
import com.ws.yay_backend.dto.request.AuthenticationRequest;
import com.ws.yay_backend.dto.request.RegisterRequest;
import com.ws.yay_backend.dto.response.AuthenticationResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Set;

@Service
public class AuthenticationServiceImpl implements AuthenticationService {
  private final UserRepository userRepository;
  private final RoleRepository roleRepository;
  private final AuthenticationManager authenticationManager;
  private final JwtService jwtService;

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
    if (isUsernameTaken(registerRequest.getUsername())) {
      throw new Exception("Username is already taken");
    }
    userRepository.save(createUserEntity(registerRequest));
  }

  @Override
  @Transactional(readOnly = true)
  public AuthenticationResponse login(AuthenticationRequest authenticationRequest) {
    authenticationManager.authenticate(
        new UsernamePasswordAuthenticationToken(
            authenticationRequest.getUsername(), authenticationRequest.getPassword()
        )
    );

    User user = userRepository.findByUsernameWithRoles(authenticationRequest.getUsername())
        .orElseThrow(() -> new IllegalArgumentException("Invalid username or password"));

    List<String> roles = user.getRoles().stream()
        .map(role -> role.getName())
        .toList();

    String jwtToken = jwtService.generateToken(new HashMap<>(), user);

    return new AuthenticationResponse(
        jwtToken,
        user.getUsername(),
        user.getId(),
        roles);
  }

  private boolean isUsernameTaken(String username) {
    return userRepository.findByUsername(username).isPresent();
  }

  private User createUserEntity(RegisterRequest registerRequest) {
    String username = registerRequest.getUsername();
    String password = registerRequest.getPassword();

    Role defaultRole = roleRepository.findByName("ROLE_USER")
        .orElseThrow(() -> new RuntimeException("Default role not found"));

    return new User(
        username,
        "{noop}" + password,
        true,
        Set.of(defaultRole)
    );
  }
}
