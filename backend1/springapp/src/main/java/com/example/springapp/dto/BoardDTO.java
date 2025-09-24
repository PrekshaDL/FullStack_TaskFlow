package com.example.springapp.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BoardDTO {
    private Long id;
    private String name;
    private String title;
    private String description;
    private Long projectId;
    
    // No relationships to avoid circular references
}