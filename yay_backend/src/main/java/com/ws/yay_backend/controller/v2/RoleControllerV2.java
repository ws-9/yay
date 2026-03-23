package com.ws.yay_backend.controller.v2;

import com.ws.yay_backend.dto.response.RoleResponseV2;
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
public class RoleControllerV2 {
  private final RoleService roleService;

  public RoleControllerV2(RoleService roleService) {
    this.roleService = roleService;
  }

  @Operation(
      summary = "Get all globally defined community roles",
      description =
          "Currently returns hardcoded global roles. Future versions will support community-specific role customization.")
  @GetMapping
  public List<RoleResponseV2> getRoles() {
    return roleService.getRolesV2();
  }
}
