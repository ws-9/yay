package com.ws.yay_backend.service;

import com.ws.yay_backend.dto.v2.response.RoleResponseV2;
import java.util.List;

public interface RoleService {
  List<RoleResponseV2> getRolesV2();
}
