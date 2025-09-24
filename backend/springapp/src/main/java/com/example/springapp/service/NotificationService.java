package com.example.springapp.service;

import com.example.springapp.model.Notification;
import com.example.springapp.repository.NotificationRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class NotificationService {

    private final NotificationRepository repo;

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
        return repo.findByUser(userId);
    }

    public List<Notification> getUnreadNotifications(Long userId) {
        return repo.findUnreadByUser(userId);
    }

    public Notification createNotification(Notification notification) {
        // Ensure ID is null for new entities to avoid optimistic locking issues
        notification.setId(null);
        return repo.save(notification);
    }

    public Notification updateNotification(Notification notification) {
        return repo.save(notification);
    }

    public void deleteNotification(Long id) {
        repo.deleteById(id);
    }
}
