package com.ws.yay_backend.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.messaging.MessageSecurityMetadataSourceRegistry;
import org.springframework.security.config.annotation.web.socket.AbstractSecurityWebSocketMessageBrokerConfigurer;

@Configuration
public class WebSocketSecurityConfig extends AbstractSecurityWebSocketMessageBrokerConfigurer {
  @Override
  protected void configureInbound(final MessageSecurityMetadataSourceRegistry messages) {
    // Customize authorization mapping
    messages.nullDestMatcher().authenticated();

    messages.simpSubscribeDestMatchers("/user/**").authenticated();
    messages.simpDestMatchers("/app/**").hasRole("USER");

//        .simpSubscribeDestMatchers("/user/queue/errors").permitAll()
//        .simpDestMatchers("/app/**").hasRole("USER")
//        .simpSubscribeDestMatchers("/user/**", "/topic/friends/*").hasRole("USER")
//        .simpTypeMatchers(MESSAGE, SUBSCRIBE).denyAll()
//        .anyMessage().denyAll();
  }

  // For testing purposes, you might have disabled simpSubscribeDestMatchersCSRF protection temporarily
  @Override
  protected boolean sameOriginDisabled() {
    return true;
  }
}