package com.localproblems.os.controller;

import com.localproblems.os.entity.Notification;
import com.localproblems.os.security.UserPrincipal;
import com.localproblems.os.service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {
    
    @Autowired
    private NotificationService notificationService;
    
    @GetMapping
    public ResponseEntity<List<Notification>> getNotifications(
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        List<Notification> notifications = notificationService
                .getUserNotifications(userPrincipal.getId());
        return ResponseEntity.ok(notifications);
    }
    
    @GetMapping("/unread")
    public ResponseEntity<List<Notification>> getUnreadNotifications(
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        List<Notification> notifications = notificationService
                .getUnreadNotifications(userPrincipal.getId());
        return ResponseEntity.ok(notifications);
    }
    
    @GetMapping("/unread/count")
    public ResponseEntity<Map<String, Long>> getUnreadCount(
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        long count = notificationService.getUnreadCount(userPrincipal.getId());
        return ResponseEntity.ok(Map.of("count", count));
    }
    
    @PatchMapping("/{id}/read")
    public ResponseEntity<Void> markAsRead(@PathVariable Long id) {
        notificationService.markAsRead(id);
        return ResponseEntity.ok().build();
    }
    
    @PatchMapping("/read-all")
    public ResponseEntity<Void> markAllAsRead(
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        notificationService.markAllAsRead(userPrincipal.getId());
        return ResponseEntity.ok().build();
    }
}
