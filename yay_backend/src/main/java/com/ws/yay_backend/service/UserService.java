package com.ws.yay_backend.service;

import com.ws.yay_backend.dto.request.UserBatchRequest;
import com.ws.yay_backend.dto.response.UserResponse;
import java.util.List;

public interface UserService {
  UserResponse getUser(long id);

  List<UserResponse> getUsersBatch(UserBatchRequest request);
}
