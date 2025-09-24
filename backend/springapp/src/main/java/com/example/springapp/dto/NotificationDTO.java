package com.example.springapp.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class NotificationDTO {
    private Long id;
    private String message;
    private String type;     // INFO, WARNING, ALERT
    private boolean isRead;
    private Long userId;
    
    // No relationships to avoid circular references
}

