package com.example.springapp.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.example.springapp.model.Project;

@Repository
public interface ProjectRepository extends JpaRepository<Project, Long> {

     @Query("SELECT p FROM Project p WHERE p.status = :status")
    List<Project> findByStatus(String status);

    @Query("SELECT p FROM Project p WHERE p.owner.id = :ownerId")
    List<Project> findByOwner(Long ownerId);
}
