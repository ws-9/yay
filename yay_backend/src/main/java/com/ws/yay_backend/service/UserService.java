package com.ws.yay_backend.service;

import com.ws.yay_backend.dto.request.UserBatchRequestV2;
import com.ws.yay_backend.dto.response.UserResponseV2;
import java.util.List;

public interface UserService {
  UserResponseV2 getUserV2(long id);

  List<UserResponseV2> getUsersBatchV2(UserBatchRequestV2 request);
}
