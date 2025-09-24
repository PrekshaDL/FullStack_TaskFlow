package com.example.springapp.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.springapp.model.Notification;
import com.example.springapp.dto.NotificationDTO;
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
    public List<Notification> getAllNotifications() {
        return service.getAllNotifications();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Notification> getNotificationById(@PathVariable Long id) {
        return service.getNotificationById(id)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Notification createNotification(@RequestBody NotificationDTO notificationDTO) {
        // Convert DTO to Entity
        Notification notification = new Notification();
        // Don't set ID - let Hibernate generate it
        notification.setMessage(notificationDTO.getMessage());
        notification.setType(notificationDTO.getType());
        notification.setRead(notificationDTO.isRead());
        // Note: user relationship would need to be set separately
        // based on userId from the DTO
        return service.createNotification(notification);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Notification> updateNotification(@PathVariable Long id, @RequestBody NotificationDTO notificationDTO) {
        // Convert DTO to Entity
        Notification notification = new Notification();
        notification.setId(id);
        notification.setMessage(notificationDTO.getMessage());
        notification.setType(notificationDTO.getType());
        notification.setRead(notificationDTO.isRead());
        // Note: user relationship would need to be set separately
        // based on userId from the DTO
        return ResponseEntity.ok(service.updateNotification(notification));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteNotification(@PathVariable Long id) {
        service.deleteNotification(id);
        return ResponseEntity.noContent().build();
    }

    // 🔹 JPQL endpoints
    @GetMapping("/unread/{userId}")
    public List<Notification> getUnreadNotifications(@PathVariable Long userId) {
        return service.getUnreadNotifications(userId);
    }
}