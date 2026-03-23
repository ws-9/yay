package com.ws.yay_backend.controller;

import com.ws.yay_backend.dto.response.RoleResponse;
import com.ws.yay_backend.service.RoleService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Tag(name = "Roles V2")
@RestController
@RequestMapping("/api/v2/roles")
public class RoleController {
  private final RoleService roleService;

  public RoleController(RoleService roleService) {
    this.roleService = roleService;
  }

  @Operation(
      summary = "Get all globally defined community roles",
      description =
          "Currently returns hardcoded global roles. Future versions will support community-specific role customization.")
  @GetMapping
  public List<RoleResponse> getRoles() {
    return roleService.getRoles();
  }
}
