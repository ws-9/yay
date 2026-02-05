package com.ws.yay_backend.controller;

import com.ws.yay_backend.dto.request.CreateBanRequest;
import com.ws.yay_backend.dto.response.BannedUserResponse;
import com.ws.yay_backend.service.BanService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bans")
public class BanController {
  private final BanService banService;

  @Autowired
  public BanController(BanService banService) {
    this.banService = banService;
  }

  @GetMapping
  public ResponseEntity<List<BannedUserResponse>> getBannedUsers(@RequestParam Long communityId) {
    List<BannedUserResponse> bannedUsers = banService.getBannedUsers(communityId);
    return ResponseEntity.ok(bannedUsers);
  }

  @PostMapping
  public ResponseEntity<BannedUserResponse> banUser(@RequestBody @Valid CreateBanRequest request) {
    BannedUserResponse bannedUser = banService.banUser(request);
    return ResponseEntity.status(HttpStatus.CREATED).body(bannedUser);
  }
}