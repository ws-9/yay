package com.ws.yay_backend.service;

import com.ws.yay_backend.dto.response.RoleResponse;
import java.util.List;

public interface RoleService {
  List<RoleResponse> getRoles();
}
