package com.localproblems.os.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OtpVerification {
    private String phoneNumber;
    private String otp;
    private LocalDateTime createdAt;
    private LocalDateTime expiresAt;
    private int attempts;
    private boolean verified;
    
    public boolean isExpired() {
        return LocalDateTime.now().isAfter(expiresAt);
    }
    
    public boolean canAttempt() {
        return attempts < 3 && !isExpired();
    }
}
