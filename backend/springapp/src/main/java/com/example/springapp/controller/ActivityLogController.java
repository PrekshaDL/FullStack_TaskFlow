package com.example.springapp.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.example.springapp.model.ActivityLog;
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
    @PreAuthorize("hasRole('ADMIN')") // Only ADMIN can get all activity logs
    public List<ActivityLog> getAllActivityLogs() {
        return service.getAllActivityLogs();
    }

    // This method will be accessed via GET /api/activitylogs/{id}
    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or (hasRole('USER') and @activityLogService.getActivityLogById(#id).map(a -> a.user.id).orElse(null) == principal.id)") // Admin or owner can get by ID
    public ResponseEntity<ActivityLog> getActivityLogById(@PathVariable Long id) {
        return service.getActivityLogById(id)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }

    // Create a new Activity Log via POST /api/activitylogs
    @PostMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('USER')") // Both can create activity logs
    public ActivityLog createActivityLog(@RequestBody ActivityLog activityLog) {
        return service.createActivityLog(activityLog);
    }

    // Update an Activity Log via PUT /api/activitylogs/{id}
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or (hasRole('USER') and @activityLogService.getActivityLogById(#id).map(a -> a.user.id).orElse(null) == principal.id)") // Admin or owner can update
    public ResponseEntity<ActivityLog> updateActivityLog(@PathVariable Long id, @RequestBody ActivityLog activityLog) {
        return ResponseEntity.ok(service.updateActivityLog(id, activityLog));
    }

    // Delete an Activity Log via DELETE /api/activitylogs/{id}
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')") // Only ADMIN can delete activity logs
    public ResponseEntity<Void> deleteActivityLog(@PathVariable Long id) {
        service.deleteActivityLog(id);
        return ResponseEntity.noContent().build();
    }

    // 🔹 JPQL endpoints
    @GetMapping("/by-user/{userId}")
    @PreAuthorize("hasRole('ADMIN') or (hasRole('USER') and #userId == principal.id)") // Admin or user can get their activity logs
    public List<ActivityLog> getLogsByUser(@PathVariable Long userId) {
        return service.getLogsByUser(userId);
    }

    @GetMapping("/after/{time}")
    @PreAuthorize("hasRole('ADMIN')") // Only ADMIN can get activity logs after a certain time
    public List<ActivityLog> getLogsAfter(@PathVariable String time) {
        return service.getLogsAfter(LocalDateTime.parse(time));
    }
}
