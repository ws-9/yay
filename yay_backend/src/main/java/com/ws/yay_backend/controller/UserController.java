package com.ws.yay_backend.controller;

import com.ws.yay_backend.dto.request.UserBatchRequest;
import com.ws.yay_backend.dto.response.UserResponse;
import com.ws.yay_backend.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.web.bind.annotation.*;

@Tag(name = "Users V2")
@RestController
@RequestMapping("/api/v2/users")
public class UserController {
  private final UserService userService;

  public UserController(UserService userService) {
    this.userService = userService;
  }

  @Operation(summary = "Get user by id")
  @GetMapping("/{id}")
  public UserResponse getUser(@PathVariable long id) {
    return userService.getUser(id);
  }

  @Operation(summary = "Batch fetch users")
  @PostMapping("/batch")
  public List<UserResponse> getUsersBatch(@RequestBody @Valid UserBatchRequest request) {
    return userService.getUsersBatch(request);
  }
}
