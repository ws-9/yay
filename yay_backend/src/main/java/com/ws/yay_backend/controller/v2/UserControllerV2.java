package com.ws.yay_backend.controller.v2;

import com.ws.yay_backend.dto.v2.request.UserBatchRequestV2;
import com.ws.yay_backend.dto.v2.response.UserResponseV2;
import com.ws.yay_backend.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.web.bind.annotation.*;

@Tag(name = "Users V2")
@RestController
@RequestMapping("/api/v2/users")
public class UserControllerV2 {
  private final UserService userService;

  public UserControllerV2(UserService userService) {
    this.userService = userService;
  }

  @Operation(summary = "Get user by id")
  @GetMapping("/{id}")
  public UserResponseV2 getUser(@PathVariable long id) {
    return userService.getUserV2(id);
  }

  @Operation(summary = "Batch fetch users")
  @PostMapping("/batch")
  public List<UserResponseV2> getUsersBatch(@RequestBody @Valid UserBatchRequestV2 request) {
    return userService.getUsersBatchV2(request);
  }
}
