package com.example.springapp.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import org.springframework.stereotype.Repository;

import com.example.springapp.model.Board;

@Repository
public interface BoardRepository extends JpaRepository<Board, Long> {
    Page<Board> findByProjectId(Long projectId, Pageable pageable);   // ✅ correct method
}
