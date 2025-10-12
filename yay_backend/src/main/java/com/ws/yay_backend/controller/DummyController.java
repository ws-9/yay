package com.ws.yay_backend.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class DummyController {
  @GetMapping("/hello")
  public String hello() {
    return "Hello World!";
  }

  @GetMapping("/restricted/user")
  public String forUsers() {
    return "Hello User!";
  }

  @GetMapping("/restricted/mod")
  public String forMods() {
    return "Hello Mod!";
  }
}
