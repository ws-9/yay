package com.ws.yay_backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {
  @Bean
  public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
    return config.getAuthenticationManager();
  }

  @Bean
  public AuthenticationEntryPoint authenticationEntryPoint() {
    return (request, response, ex) -> {
      response.setStatus(HttpStatus.UNAUTHORIZED.value());
      response.setContentType("application/json");
      response.setHeader("WWW-Authenticate", "");
      response.getWriter().write("{\"error\": \"Unauthorized access\"}");
    };
  }

  @Bean
  public WebMvcConfigurer corsConfigurer() {
    return new WebMvcConfigurer() {
      @Override
      public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
            .allowedOrigins("http://localhost:5173")
            .allowedMethods("GET","POST","PUT","DELETE");
      }
    };
  }

  @Bean
  public SecurityFilterChain filterChain(HttpSecurity http, JwtAuthenticationFilter jwtAuthenticationFilter) throws Exception {
    http.authorizeHttpRequests(configurer ->
        configurer
            .requestMatchers("/docs/**", "/swagger-ui/**", "/v3/api-docs/**", "/swagger-ui.html").permitAll()
            .requestMatchers(HttpMethod.POST, "/api/auth/*").permitAll()
            .requestMatchers(HttpMethod.GET, "/api/communities").hasAnyRole("USER", "MOD", "ADMIN", "SUPER_ADMIN")
            .requestMatchers(HttpMethod.POST, "/api/communities").hasAnyRole("USER", "MOD", "ADMIN", "SUPER_ADMIN")
            .requestMatchers(HttpMethod.GET, "/api/communities/*").hasAnyRole("USER", "MOD", "ADMIN", "SUPER_ADMIN")
            .requestMatchers(HttpMethod.DELETE, "/api/communities/*").hasAnyRole("USER", "MOD", "ADMIN", "SUPER_ADMIN")
            .requestMatchers(HttpMethod.GET, "/api/communities/*/members").hasAnyRole("USER", "MOD", "ADMIN", "SUPER_ADMIN")
            .requestMatchers(HttpMethod.POST, "/api/communities/*/members").hasAnyRole("USER", "MOD", "ADMIN", "SUPER_ADMIN")
            .requestMatchers(HttpMethod.DELETE, "/api/communities/*/members/*").hasAnyRole("USER", "MOD", "ADMIN", "SUPER_ADMIN")
            .requestMatchers(HttpMethod.GET, "/api/communities/*/channels").hasAnyRole("USER", "MOD", "ADMIN", "SUPER_ADMIN")
            .requestMatchers(HttpMethod.POST, "/api/channels").hasAnyRole("USER", "MOD", "ADMIN", "SUPER_ADMIN")
            .requestMatchers(HttpMethod.POST, "/api/members").hasAnyRole("USER", "MOD", "ADMIN", "SUPER_ADMIN")
            .requestMatchers(HttpMethod.DELETE, "/api/members").hasAnyRole("USER", "MOD", "ADMIN", "SUPER_ADMIN")
    );

    http.httpBasic(Customizer.withDefaults());
    http.csrf(AbstractHttpConfigurer::disable);
    http.cors(Customizer.withDefaults());
    http.exceptionHandling(exceptionHandling ->
        exceptionHandling.authenticationEntryPoint(authenticationEntryPoint()));
    http.sessionManagement(session ->
        session.sessionCreationPolicy(SessionCreationPolicy.STATELESS));
    http.addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);
    return http.build();
  }
}

