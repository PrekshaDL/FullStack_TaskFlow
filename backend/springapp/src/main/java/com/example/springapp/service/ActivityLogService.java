package com.example.springapp.service;

import com.example.springapp.model.ActivityLog;
import com.example.springapp.repository.ActivityLogRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class ActivityLogService {

    private final ActivityLogRepository repo;

    public ActivityLogService(ActivityLogRepository repo) {
        this.repo = repo;
    }

    public List<ActivityLog> getAllActivityLogs() {
        return repo.findAll();
    }

    public Optional<ActivityLog> getActivityLogById(Long id) {
        return repo.findById(id);
    }

     public ActivityLog createActivityLog(ActivityLog activityLog) {
        // Ensure ID is null for new entities to avoid optimistic locking issues
        activityLog.setId(null);
        return repo.save(activityLog);
    }

    public ActivityLog updateActivityLog(ActivityLog activityLog) {
        return repo.save(activityLog);
    }

    public void deleteActivityLog(Long id) {
        repo.deleteById(id);
    }

    // 🔹 Existing JPQL
    public List<ActivityLog> getLogsByUser(Long userId) {
        return repo.findByUserId(userId);
    }

    // 🔹 New JPQL
    public List<ActivityLog> getLogsAfter(LocalDateTime timestamp) {
        return repo.findByTimestampAfter(timestamp);
    }
}
