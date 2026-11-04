package com.localproblems.os.service;

import com.twilio.rest.api.v2010.account.Message;
import com.twilio.type.PhoneNumber;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class SmsService {
    
    private static final Logger log = LoggerFactory.getLogger(SmsService.class);

    @Value("${app.sms.enabled}")
    private boolean smsEnabled;

    @Value("${app.twilio.phone-number}")
    private String twilioPhoneNumber;

    @Value("${app.twilio.whatsapp-number}")
    private String twilioWhatsAppNumber;

    /**
     * Send SMS message
     */
    public boolean sendSms(String toPhoneNumber, String messageText) {
        if (!smsEnabled) {
            log.info("SMS disabled. Would have sent to {}: {}", toPhoneNumber, messageText);
            return true; // Return true in development
        }

        try {
            Message message = Message.creator(
                    new PhoneNumber(toPhoneNumber),
                    new PhoneNumber(twilioPhoneNumber),
                    messageText
            ).create();

            log.info("SMS sent successfully. SID: {}", message.getSid());
            return true;
        } catch (Exception e) {
            log.error("Failed to send SMS to {}: {}", toPhoneNumber, e.getMessage());
            return false;
        }
    }

    /**
     * Send WhatsApp message
     */
    public boolean sendWhatsApp(String toPhoneNumber, String messageText) {
        if (!smsEnabled) {
            log.info("WhatsApp disabled. Would have sent to {}: {}", toPhoneNumber, messageText);
            return true; // Return true in development
        }

        try {
            // Ensure phone number is in WhatsApp format
            String whatsappTo = toPhoneNumber.startsWith("whatsapp:") 
                ? toPhoneNumber 
                : "whatsapp:" + toPhoneNumber;

            Message message = Message.creator(
                    new PhoneNumber(whatsappTo),
                    new PhoneNumber(twilioWhatsAppNumber),
                    messageText
            ).create();

            log.info("WhatsApp sent successfully. SID: {}", message.getSid());
            return true;
        } catch (Exception e) {
            log.error("Failed to send WhatsApp to {}: {}", toPhoneNumber, e.getMessage());
            return false;
        }
    }

    /**
     * Send notification based on channel preference
     */
    public boolean sendNotification(String toPhoneNumber, String messageText, String channel) {
        if ("whatsapp".equalsIgnoreCase(channel)) {
            return sendWhatsApp(toPhoneNumber, messageText);
        } else {
            return sendSms(toPhoneNumber, messageText);
        }
    }

    /**
     * Send issue status update notification
     */
    public void sendIssueStatusUpdate(String phoneNumber, String issueId, String oldStatus, String newStatus) {
        String message = String.format(
            "Issue Update - Your reported issue #%s status changed from %s to %s. Track it on India Local Problems Portal.",
            issueId, oldStatus, newStatus
        );
        sendSms(phoneNumber, message);
    }

    /**
     * Send issue assignment notification
     */
    public void sendIssueAssignmentNotification(String phoneNumber, String issueId, String officerName) {
        String message = String.format(
            "Issue Assigned - Your issue #%s has been assigned to %s. You will receive updates soon.",
            issueId, officerName
        );
        sendSms(phoneNumber, message);
    }

    /**
     * Send issue resolution notification
     */
    public void sendIssueResolvedNotification(String phoneNumber, String issueId) {
        String message = String.format(
            "Issue Resolved - Great news! Your reported issue #%s has been marked as resolved. Please verify the resolution.",
            issueId
        );
        sendSms(phoneNumber, message);
    }

    /**
     * Send critical alert
     */
    public void sendCriticalAlert(String phoneNumber, String alertMessage) {
        String message = String.format(
            "URGENT ALERT: %s - India Local Problems Portal",
            alertMessage
        );
        sendSms(phoneNumber, message);
    }
}
