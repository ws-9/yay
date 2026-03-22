package com.ws.yay_backend.dao;

import com.ws.yay_backend.entity.User;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface UserRepository extends JpaRepository<User, Long> {
  Optional<User> findByUsername(String username);

  @Query("SELECT u FROM User u JOIN FETCH u.roles WHERE u.username = :username")
  Optional<User> findByUsernameWithRoles(@Param("username") String username);
}
