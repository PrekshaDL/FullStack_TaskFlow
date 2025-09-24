package com.example.springapp.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ActivityLogDTO {
    private Long id;
    private String action;
    private String performedBy;
    private LocalDateTime timestamp;
    private Long userId;
    private Long taskId;
    private Long projectId;
    
    // No relationships to avoid circular references
}

