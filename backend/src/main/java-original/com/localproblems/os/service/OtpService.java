package com.localproblems.os.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class OtpService {
    
    private static final Logger log = LoggerFactory.getLogger(OtpService.class);

    private final SmsService smsService;

    @Value("${app.otp.enabled}")
    private boolean otpEnabled;

    @Value("${app.otp.length}")
    private int otpLength;

    @Value("${app.otp.expiry-minutes}")
    private int expiryMinutes;

    @Value("${app.otp.max-attempts}")
    private int maxAttempts;

    private final Map<String, OtpData> otpStore = new ConcurrentHashMap<>();
    private final Map<String, Integer> attemptStore = new ConcurrentHashMap<>();
    
    @Autowired
    public OtpService(SmsService smsService) {
        this.smsService = smsService;
    }

    private static class OtpData {
        String otp;
        LocalDateTime expiryTime;
        String channel;

        OtpData(String otp, LocalDateTime expiryTime, String channel) {
            this.otp = otp;
            this.expiryTime = expiryTime;
            this.channel = channel;
        }
    }

    /**
     * Generate and send OTP
     */
    public boolean sendOtp(String phoneNumber, String channel) {
        if (!otpEnabled) {
            log.info("OTP disabled. Bypassing OTP for development");
            return true;
        }

        // Generate OTP
        String otp = generateOtp();
        LocalDateTime expiryTime = LocalDateTime.now().plusMinutes(expiryMinutes);

        // Store OTP
        otpStore.put(phoneNumber, new OtpData(otp, expiryTime, channel));
        attemptStore.put(phoneNumber, 0);

        // Send OTP via SMS or WhatsApp
        String message = String.format(
            "Your OTP for India Local Problems Portal is: %s. Valid for %d minutes. Do not share this code.",
            otp, expiryMinutes
        );

        boolean sent = smsService.sendNotification(phoneNumber, message, channel);

        if (sent) {
            log.info("OTP sent to {} via {}", maskPhoneNumber(phoneNumber), channel);
        } else {
            log.error("Failed to send OTP to {}", maskPhoneNumber(phoneNumber));
        }

        return sent;
    }

    /**
     * Verify OTP
     */
    public boolean verifyOtp(String phoneNumber, String otp) {
        if (!otpEnabled) {
            log.info("OTP disabled. Bypassing verification for development");
            return true;
        }

        // Check if OTP exists
        OtpData otpData = otpStore.get(phoneNumber);
        if (otpData == null) {
            log.warn("No OTP found for phone number: {}", maskPhoneNumber(phoneNumber));
            return false;
        }

        // Check attempts
        int attempts = attemptStore.getOrDefault(phoneNumber, 0);
        if (attempts >= maxAttempts) {
            log.warn("Max OTP attempts exceeded for: {}", maskPhoneNumber(phoneNumber));
            clearOtp(phoneNumber);
            return false;
        }

        // Check expiry
        if (LocalDateTime.now().isAfter(otpData.expiryTime)) {
            log.warn("OTP expired for: {}", maskPhoneNumber(phoneNumber));
            clearOtp(phoneNumber);
            return false;
        }

        // Verify OTP
        if (otpData.otp.equals(otp)) {
            log.info("OTP verified successfully for: {}", maskPhoneNumber(phoneNumber));
            clearOtp(phoneNumber);
            return true;
        } else {
            // Increment attempts
            attemptStore.put(phoneNumber, attempts + 1);
            log.warn("Invalid OTP for: {}. Attempts: {}/{}", 
                maskPhoneNumber(phoneNumber), attempts + 1, maxAttempts);
            return false;
        }
    }

    /**
     * Clear OTP data
     */
    private void clearOtp(String phoneNumber) {
        otpStore.remove(phoneNumber);
        attemptStore.remove(phoneNumber);
    }

    /**
     * Generate random OTP
     */
    private String generateOtp() {
        SecureRandom random = new SecureRandom();
        StringBuilder otp = new StringBuilder();
        
        for (int i = 0; i < otpLength; i++) {
            otp.append(random.nextInt(10));
        }
        
        return otp.toString();
    }

    /**
     * Mask phone number for logging
     */
    private String maskPhoneNumber(String phoneNumber) {
        if (phoneNumber == null || phoneNumber.length() < 4) {
            return "****";
        }
        return phoneNumber.substring(0, 2) + "****" + phoneNumber.substring(phoneNumber.length() - 2);
    }

    /**
     * Check if OTP is enabled
     */
    public boolean isOtpEnabled() {
        return otpEnabled;
    }

    /**
     * Get expiry minutes
     */
    public int getExpiryMinutes() {
        return expiryMinutes;
    }
}
