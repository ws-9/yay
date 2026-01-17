package com.ws.yay_backend.components;

import com.ws.yay_backend.dao.UserRepository;
import com.ws.yay_backend.entity.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ResponseStatusException;

@Component
public class AuthUtilsComponent {
  private final UserRepository userRepository;

  @Autowired
  public AuthUtilsComponent(UserRepository userRepository) {
    this.userRepository = userRepository;
  }

  public User getAuthenticatedUser() {
    Authentication auth = SecurityContextHolder.getContext().getAuthentication();

    String username = auth.getName();
    return userRepository.findByUsername(username)
        .orElseThrow(() -> new ResponseStatusException(
            HttpStatus.INTERNAL_SERVER_ERROR,
            "Authenticated user not found: " + username
        ));
  }

  public Long getAuthenticatedUserId() {
    Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
    Object principal = authentication.getPrincipal();
    
    if (principal instanceof User user) {
      return user.getId();
    }
    
    throw new ResponseStatusException(
        HttpStatus.INTERNAL_SERVER_ERROR,
        "Unable to get authenticated user ID"
    );
  }

  public boolean isCurrentUserAdmin() {
    Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
    return authentication.getAuthorities().stream()
        .anyMatch(auth -> auth.getAuthority().equals("ROLE_ADMIN"));
  }
}
