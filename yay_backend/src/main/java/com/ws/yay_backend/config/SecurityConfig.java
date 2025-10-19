package com.ws.yay_backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {
  @Bean
  public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
    http.authorizeHttpRequests(configurer ->
        configurer
            .requestMatchers("/docs/**", "/swagger-ui/**", "/v3/api-docs/**", "/swagger-ui.html").permitAll()
            .requestMatchers(HttpMethod.GET, "/api/hello").permitAll()
            .requestMatchers(HttpMethod.GET, "/api/restricted/user").hasAnyRole("USER", "MODERATOR", "ADMIN", "SUPER_ADMIN")
            .requestMatchers(HttpMethod.GET, "/api/restricted/mod").hasRole("MODERATOR")
            .requestMatchers(HttpMethod.GET, "/api/communities").hasAnyRole("USER", "MODERATOR", "ADMIN", "SUPER_ADMIN")
            .requestMatchers(HttpMethod.POST, "/api/communities").hasAnyRole("USER", "MODERATOR", "ADMIN", "SUPER_ADMIN")
    );

    http.httpBasic(Customizer.withDefaults());
    http.csrf(AbstractHttpConfigurer::disable);
    return http.build();
  }
}

