package com.example.springapp.model;

import java.util.List;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
public class Project {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String description;
    private String status;   // e.g., ACTIVE, COMPLETED

    @ManyToOne(fetch = FetchType.LAZY) // Added FetchType.LAZY for performance
    @JoinColumn(name = "owner_id")
    private User owner;

    @Transient // Mark as transient as frontend sends ownerId directly
    private Long ownerId;

    @OneToMany(mappedBy = "project", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Board> boards;
}