package com.example.springapp.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.example.springapp.model.Notification;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {

     @Query("SELECT n FROM Notification n WHERE n.user.id = :userId ORDER BY n.id DESC")
    List<Notification> findByUser(Long userId);

    @Query("SELECT n FROM Notification n WHERE n.isRead = false AND n.user.id = :userId")
    List<Notification> findUnreadByUser(Long userId);
}