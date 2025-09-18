package com.example.springapp.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.example.springapp.model.Task;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {

    @Query("SELECT t FROM Task t WHERE t.status = :status")
    List<Task> findByStatus(String status);

    @Query("SELECT t FROM Task t WHERE t.priority = :priority")
    List<Task> findByPriority(String priority);

    // Method to find tasks by assignee ID with pagination
    Page<Task> findByAssigneeId(Long assigneeId, Pageable pageable);

    // Method to find tasks by board ID with pagination
    Page<Task> findByBoardId(Long boardId, Pageable pageable);
}

