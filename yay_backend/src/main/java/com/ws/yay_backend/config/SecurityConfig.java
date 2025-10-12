package com.ws.yay_backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.provisioning.InMemoryUserDetailsManager;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {
  @Bean
  public UserDetailsService userDetailsService() {
    InMemoryUserDetailsManager userDetailsManager = new InMemoryUserDetailsManager();
    UserDetails user = User.builder()
        .username("user")
        .password("{noop}password")
        .roles("USER")
        .build();

    UserDetails mod = User.builder()
        .username("mod")
        .password("{noop}password")
        .roles("USER", "MODERATOR")
        .build();

    userDetailsManager.createUser(user);
    userDetailsManager.createUser(mod);

    return userDetailsManager;
  }

  @Bean
  public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
    http.authorizeHttpRequests(configurer ->
        configurer
            .requestMatchers("/docs/**", "/swagger-ui/**", "/v3/api-docs/**", "/swagger-ui.html").permitAll()
            .requestMatchers(HttpMethod.GET, "/api/hello").permitAll()
            .requestMatchers(HttpMethod.GET, "/api/restricted/user").hasAnyRole("USER", "MODERATOR")
            .requestMatchers(HttpMethod.GET, "/api/restricted/mod").hasRole("MODERATOR")
    );

    http.httpBasic(Customizer.withDefaults());
    http.csrf(AbstractHttpConfigurer::disable);
    return http.build();
  }
}

