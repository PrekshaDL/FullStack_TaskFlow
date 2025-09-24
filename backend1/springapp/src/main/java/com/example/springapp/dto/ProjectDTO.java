package com.example.springapp.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProjectDTO {
    private Long id;
    private String name;
    private String description;
    private String status;   // e.g., ACTIVE, COMPLETED
    private Long ownerId;
    
    // No relationships to avoid circular references
}

