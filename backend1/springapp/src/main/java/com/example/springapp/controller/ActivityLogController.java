package com.example.springapp.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.springapp.model.ActivityLog;
import com.example.springapp.dto.ActivityLogDTO;
import com.example.springapp.service.ActivityLogService;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/activitylogs")
public class ActivityLogController {
    private final ActivityLogService service;

    public ActivityLogController(ActivityLogService service) {
        this.service = service;
    }

    // This method should be accessible via GET /api/activitylogs/all
    @GetMapping("/all")
    public List<ActivityLog> getAllActivityLogs() {
        return service.getAllActivityLogs();
    }

    // This method will be accessed via GET /api/activitylogs/{id}
    @GetMapping("/{id}")
    public ResponseEntity<ActivityLog> getActivityLogById(@PathVariable Long id) {
        return service.getActivityLogById(id)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }

    // Create a new Activity Log via POST /api/activitylogs
    @PostMapping
    public ActivityLog createActivityLog(@RequestBody ActivityLogDTO activityLogDTO) {
        // Convert DTO to Entity
        ActivityLog activityLog = new ActivityLog();
        // Don't set ID - let Hibernate generate it
        activityLog.setAction(activityLogDTO.getAction());
        activityLog.setPerformedBy(activityLogDTO.getPerformedBy());
        activityLog.setTimestamp(activityLogDTO.getTimestamp());
        // Note: user, task, and project relationships would need to be set separately
        // based on userId, taskId, and projectId from the DTO
        return service.createActivityLog(activityLog);
    }

    // Update an Activity Log via PUT /api/activitylogs/{id}
    @PutMapping("/{id}")
    public ResponseEntity<ActivityLog> updateActivityLog(@PathVariable Long id, @RequestBody ActivityLogDTO activityLogDTO) {
        // Convert DTO to Entity
        ActivityLog activityLog = new ActivityLog();
        activityLog.setId(id);
        activityLog.setAction(activityLogDTO.getAction());
        activityLog.setPerformedBy(activityLogDTO.getPerformedBy());
        activityLog.setTimestamp(activityLogDTO.getTimestamp());
        // Note: user, task, and project relationships would need to be set separately
        // based on userId, taskId, and projectId from the DTO
        return ResponseEntity.ok(service.updateActivityLog(activityLog));
    }

    // Delete an Activity Log via DELETE /api/activitylogs/{id}
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteActivityLog(@PathVariable Long id) {
        service.deleteActivityLog(id);
        return ResponseEntity.noContent().build();
    }

    // 🔹 JPQL endpoints
    @GetMapping("/by-user/{userId}")
    public List<ActivityLog> getLogsByUser(@PathVariable Long userId) {
        return service.getLogsByUser(userId);
    }

    @GetMapping("/after/{time}")
    public List<ActivityLog> getLogsAfter(@PathVariable String time) {
        return service.getLogsAfter(LocalDateTime.parse(time));
    }
}
