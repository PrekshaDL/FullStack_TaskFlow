package com.example.springapp.model;


import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
public class Task {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private String description;
    private String status;   // e.g., TODO, IN_PROGRESS, DONE
    private String priority; // e.g., LOW, MEDIUM, HIGH

    @ManyToOne(fetch = FetchType.LAZY) // Added FetchType.LAZY for performance
    @JoinColumn(name = "board_id")
    private Board board;

    @Transient // Mark as transient as frontend sends boardId directly
    private Long boardId;

    @ManyToOne(fetch = FetchType.LAZY) // Added FetchType.LAZY for performance
    @JoinColumn(name = "assignee_id")
    private User assignee;

    @Transient // Mark as transient as frontend sends assigneeId directly
    private Long assigneeId;
}