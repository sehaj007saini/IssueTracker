package com.localproblems.os.service;

import com.localproblems.os.entity.Notification;
import com.localproblems.os.entity.NotificationPreference;
import com.localproblems.os.entity.User;
import com.localproblems.os.repository.NotificationPreferenceRepository;
import com.localproblems.os.repository.NotificationRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class NotificationService {
    
    private static final Logger log = LoggerFactory.getLogger(NotificationService.class);
    
    @Autowired
    private NotificationRepository notificationRepository;
    
    @Autowired
    private NotificationPreferenceRepository preferenceRepository;
    
    @Autowired
    private SimpMessagingTemplate messagingTemplate;
    
    @Autowired
    private SmsService smsService;
    
    @Transactional
    public Notification createNotification(User user, Notification.NotificationType type, 
                                          String title, String message, Long issueId) {
        Notification notification = new Notification();
        notification.setUser(user);
        notification.setType(type);
        notification.setTitle(title);
        notification.setMessage(message);
        notification.setIssueId(issueId);
        notification.setIsRead(false);
        
        notification = notificationRepository.save(notification);
        
        // Send real-time notification via WebSocket
        sendRealTimeNotification(user.getId(), notification);
        
        // Send via SMS/WhatsApp if enabled
        sendMultiChannelNotification(user, notification);
        
        return notification;
    }
    
    /**
     * Send notification via multiple channels (SMS, WhatsApp) based on user preferences
     */
    private void sendMultiChannelNotification(User user, Notification notification) {
        // Check if user has phone number
        if (user.getPhone() == null || user.getPhone().trim().isEmpty()) {
            return;
        }
        
        // Get user preferences or use defaults
        NotificationPreference pref = preferenceRepository
            .findByUserIdAndNotificationType(user.getId(), "ALL")
            .orElse(null);
        
        // Default behavior if no preferences set: send SMS only for critical
        boolean sendSms = pref != null && pref.getSmsEnabled();
        boolean sendWhatsApp = pref != null && pref.getWhatsappEnabled();
        boolean isCritical = notification.getType() == Notification.NotificationType.ISSUE_URGENT;
        
        // Always send for critical alerts
        if (isCritical) {
            sendSms = true;
        }
        
        String message = notification.getTitle() + " - " + notification.getMessage();
        
        // Send SMS if enabled
        if (sendSms) {
            try {
                smsService.sendSms(user.getPhone(), message);
                log.info("SMS notification sent to user {}", user.getId());
            } catch (Exception e) {
                log.error("Failed to send SMS to user {}: {}", user.getId(), e.getMessage());
            }
        }
        
        // Send WhatsApp if enabled
        if (sendWhatsApp) {
            try {
                smsService.sendWhatsApp(user.getPhone(), message);
                log.info("WhatsApp notification sent to user {}", user.getId());
            } catch (Exception e) {
                log.error("Failed to send WhatsApp to user {}: {}", user.getId(), e.getMessage());
            }
        }
    }
    
    public void sendRealTimeNotification(Long userId, Notification notification) {
        messagingTemplate.convertAndSendToUser(
            userId.toString(),
            "/queue/notifications",
            notification
        );
    }
    
    public List<Notification> getUserNotifications(Long userId) {
        return notificationRepository.findByUser_IdOrderByCreatedAtDesc(userId);
    }
    
    public List<Notification> getUnreadNotifications(Long userId) {
        return notificationRepository.findByUser_IdAndIsReadFalseOrderByCreatedAtDesc(userId);
    }
    
    public long getUnreadCount(Long userId) {
        return notificationRepository.countByUser_IdAndIsReadFalse(userId);
    }
    
    @Transactional
    public void markAsRead(Long notificationId) {
        notificationRepository.findById(notificationId).ifPresent(notification -> {
            notification.setIsRead(true);
            notificationRepository.save(notification);
        });
    }
    
    @Transactional
    public void markAllAsRead(Long userId) {
        List<Notification> unreadNotifications = getUnreadNotifications(userId);
        unreadNotifications.forEach(notification -> notification.setIsRead(true));
        notificationRepository.saveAll(unreadNotifications);
    }
}
