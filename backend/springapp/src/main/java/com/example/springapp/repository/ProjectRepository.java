package com.example.springapp.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.example.springapp.model.Project;

@Repository
public interface ProjectRepository extends JpaRepository<Project, Long> {

     @Query("SELECT p FROM Project p WHERE p.status = :status")
    List<Project> findByStatus(String status);

    // Method to find projects by owner ID with pagination
    Page<Project> findByOwnerId(Long ownerId, Pageable pageable);
}
