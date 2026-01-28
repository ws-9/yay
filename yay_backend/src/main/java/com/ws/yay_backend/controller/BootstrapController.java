package com.ws.yay_backend.controller;

import com.ws.yay_backend.dto.response.AppBootstrapResponse;
import com.ws.yay_backend.service.BootstrapService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Tag(name = "Bootstrap")
@RestController
@RequestMapping("/api/bootstrap")
public class BootstrapController {
  private final BootstrapService bootstrapService;

  @Autowired
  public BootstrapController(BootstrapService bootstrapService) {
    this.bootstrapService = bootstrapService;
  }

  @Operation(summary = "Get bootstrap data with user info and communities")
  @GetMapping
  public AppBootstrapResponse getBootstrapData() {
    return bootstrapService.getBootstrapData();
  }
}
