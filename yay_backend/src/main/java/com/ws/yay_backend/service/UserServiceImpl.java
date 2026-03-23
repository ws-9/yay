package com.ws.yay_backend.service;

import com.ws.yay_backend.dao.UserRepository;
import com.ws.yay_backend.dto.v2.request.UserBatchRequestV2;
import com.ws.yay_backend.dto.v2.response.UserResponseV2;
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
  public UserResponseV2 getUserV2(long id) {
    User user =
        userRepository
            .findById(id)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
    return UserResponseV2.fromEntity(user);
  }

  @Override
  @Transactional(readOnly = true)
  public List<UserResponseV2> getUsersBatchV2(UserBatchRequestV2 request) {
    List<User> users = userRepository.findAllById(request.ids());
    return users.stream().map(UserResponseV2::fromEntity).toList();
  }
}
