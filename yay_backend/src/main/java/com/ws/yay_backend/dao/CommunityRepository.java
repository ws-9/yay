package com.ws.yay_backend.dao;

import com.ws.yay_backend.entity.Community;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CommunityRepository extends JpaRepository<Community, Long> {
  // Eagerly load owners
  @Override
  @EntityGraph(attributePaths = {"owner"})
  List<Community> findAll();
}
