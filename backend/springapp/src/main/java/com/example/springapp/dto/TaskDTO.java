package com.example.springapp.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TaskDTO {
    private Long id;
    private String title;
    private String description;
    private String status;   // e.g., TODO, IN_PROGRESS, DONE
    private String priority; // e.g., LOW, MEDIUM, HIGH
    private Long boardId;
    private Long assigneeId;
    
    // No relationships to avoid circular references
}

