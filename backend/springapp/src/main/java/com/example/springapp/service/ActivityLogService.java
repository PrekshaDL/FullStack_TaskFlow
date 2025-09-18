package com.example.springapp.service;

import com.example.springapp.model.ActivityLog;
import com.example.springapp.model.Project;
import com.example.springapp.model.Task;
import com.example.springapp.model.User;
import com.example.springapp.repository.ActivityLogRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class ActivityLogService {

    private final ActivityLogRepository repo;

    @Autowired
    private UserService userService;

    @Autowired
    private TaskService taskService;

    @Autowired
    private ProjectService projectService;

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
        if (activityLog.getUserId() != null) {
            User user = userService.getUserById(activityLog.getUserId());
            activityLog.setUser(user);
        }
        if (activityLog.getTaskId() != null) {
            Task task = taskService.getTaskById(activityLog.getTaskId());
            activityLog.setTask(task);
        }
        if (activityLog.getProjectId() != null) {
            Project project = projectService.getProjectById(activityLog.getProjectId());
            activityLog.setProject(project);
        }
        return repo.save(activityLog);
    }

    public ActivityLog updateActivityLog(Long id, ActivityLog activityLogDetails) {
        ActivityLog activityLog = repo.findById(id).orElseThrow(() -> new RuntimeException("ActivityLog not found"));
        activityLog.setAction(activityLogDetails.getAction());
        activityLog.setDescription(activityLogDetails.getDescription());
        activityLog.setPerformedBy(activityLogDetails.getPerformedBy());
        activityLog.setTimestamp(activityLogDetails.getTimestamp());

        if (activityLogDetails.getUserId() != null) {
            User user = userService.getUserById(activityLogDetails.getUserId());
            activityLog.setUser(user);
        } else if (activityLogDetails.getUserId() == null) { // Allow disassociating user
            activityLog.setUser(null);
        }

        if (activityLogDetails.getTaskId() != null) {
            Task task = taskService.getTaskById(activityLogDetails.getTaskId());
            activityLog.setTask(task);
        } else if (activityLogDetails.getTaskId() == null) { // Allow disassociating task
            activityLog.setTask(null);
        }

        if (activityLogDetails.getProjectId() != null) {
            Project project = projectService.getProjectById(activityLogDetails.getProjectId());
            activityLog.setProject(project);
        } else if (activityLogDetails.getProjectId() == null) { // Allow disassociating project
            activityLog.setProject(null);
        }

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
