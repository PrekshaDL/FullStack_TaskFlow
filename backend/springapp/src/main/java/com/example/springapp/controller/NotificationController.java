package com.example.springapp.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.example.springapp.model.Notification;
import com.example.springapp.service.NotificationService;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {
    private final NotificationService service;

    public NotificationController(NotificationService service) {
        this.service = service;
    }

    @GetMapping("/all")
    @PreAuthorize("hasRole('ADMIN')") // Only ADMIN can get all notifications
    public List<Notification> getAllNotifications() {
        return service.getAllNotifications();
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or (hasRole('USER') and @notificationService.getNotificationById(#id).map(n -> n.user.id).orElse(null) == principal.id)") // Admin or owner can get by ID
    public ResponseEntity<Notification> getNotificationById(@PathVariable Long id) {
        return service.getNotificationById(id)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/user/{userId}")
    @PreAuthorize("hasRole('ADMIN') or (hasRole('USER') and #userId == principal.id)") // Admin or user can get their notifications
    public List<Notification> getNotificationsByUser(@PathVariable Long userId) {
        return service.getNotificationsByUser(userId);
    }

    @GetMapping("/unread/{userId}")
    @PreAuthorize("hasRole('ADMIN') or (hasRole('USER') and #userId == principal.id)") // Admin or user can get their unread notifications
    public List<Notification> getUnreadNotifications(@PathVariable Long userId) {
        return service.getUnreadNotifications(userId);
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')") // Only ADMIN can create notifications
    public Notification createNotification(@RequestBody Notification notification) {
        return service.createNotification(notification);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or (hasRole('USER') and @notificationService.getNotificationById(#id).map(n -> n.user.id).orElse(null) == principal.id)") // Admin or owner can update
    public ResponseEntity<Notification> updateNotification(@PathVariable Long id, @RequestBody Notification notification) {
        return ResponseEntity.ok(service.updateNotification(id, notification));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or (hasRole('USER') and @notificationService.getNotificationById(#id).map(n -> n.user.id).orElse(null) == principal.id)") // Admin or owner can delete
    public ResponseEntity<Void> deleteNotification(@PathVariable Long id) {
        service.deleteNotification(id);
        return ResponseEntity.noContent().build();
    }
}