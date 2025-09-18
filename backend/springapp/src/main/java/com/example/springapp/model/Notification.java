package com.example.springapp.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Transient;
import lombok.Data;

@Entity
@Data
public class Notification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title; // Added title field as per frontend model
    private String message;
    private String type;     // INFO, WARNING, ALERT

    @Column(name = "is_read")
    private boolean isRead;

    @ManyToOne(fetch = FetchType.LAZY) // Added FetchType.LAZY for performance
    @JoinColumn(name = "user_id")
    private User user;

    @Transient // Mark as transient as frontend sends userId directly
    private Long userId;
}
