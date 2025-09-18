package com.example.springapp.service;

import com.example.springapp.model.Notification;
import com.example.springapp.model.User;
import com.example.springapp.repository.NotificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class NotificationService {

    private final NotificationRepository repo;

    @Autowired
    private UserService userService; // Inject UserService

    public NotificationService(NotificationRepository repo) {
        this.repo = repo;
    }

    public List<Notification> getAllNotifications() {
        return repo.findAll();
    }

    public Optional<Notification> getNotificationById(Long id) {
        return repo.findById(id);
    }

    public List<Notification> getNotificationsByUser(Long userId) {
        return repo.findByUserId(userId);
    }

    public List<Notification> getUnreadNotifications(Long userId) {
        return repo.findByUserIdAndIsReadFalse(userId);
    }

    public Notification createNotification(Notification notification) {
        if (notification.getUserId() != null) {
            User user = userService.getUserById(notification.getUserId());
            notification.setUser(user);
        }
        return repo.save(notification);
    }

    public Notification updateNotification(Long id, Notification notificationDetails) {
        Notification notification = repo.findById(id).orElseThrow(() -> new RuntimeException("Notification not found"));
        notification.setTitle(notificationDetails.getTitle()); // Update title
        notification.setMessage(notificationDetails.getMessage());
        notification.setType(notificationDetails.getType());
        notification.setRead(notificationDetails.isRead());
        if (notificationDetails.getUserId() != null) {
            User user = userService.getUserById(notificationDetails.getUserId());
            notification.setUser(user);
        } else if (notificationDetails.getUserId() == null) { // Allow disassociating user
            notification.setUser(null);
        }
        return repo.save(notification);
    }

    public void deleteNotification(Long id) {
        repo.deleteById(id);
    }
}
