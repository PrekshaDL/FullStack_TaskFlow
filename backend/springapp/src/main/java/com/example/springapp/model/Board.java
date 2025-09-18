package com.example.springapp.model;


import java.util.List;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
public class Board {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name; 
    private String title;
    private String description;

    @ManyToOne(fetch = FetchType.LAZY) // Added FetchType.LAZY for performance
    @JoinColumn(name = "project_id")
    private Project project;

    @Transient // Mark as transient as frontend sends projectId directly
    private Long projectId;

    @OneToMany(mappedBy = "board", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Task> tasks;
}