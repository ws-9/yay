package com.ws.yay_backend.service;

import com.ws.yay_backend.dao.UserRepository;
import com.ws.yay_backend.dto.request.UserBatchRequest;
import com.ws.yay_backend.dto.response.UserResponse;
import com.ws.yay_backend.entity.User;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
public class UserServiceImpl implements UserService {
  private final UserRepository userRepository;

  public UserServiceImpl(UserRepository userRepository) {
    this.userRepository = userRepository;
  }

  @Override
  @Transactional(readOnly = true)
  public UserResponse getUser(long id) {
    User user =
        userRepository
            .findById(id)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
    return UserResponse.fromEntity(user);
  }

  @Override
  @Transactional(readOnly = true)
  public List<UserResponse> getUsersBatch(UserBatchRequest request) {
    List<User> users = userRepository.findAllById(request.ids());
    return users.stream().map(UserResponse::fromEntity).toList();
  }
}
