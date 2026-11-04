package com.localproblems.os.controller;

import com.localproblems.os.dto.request.OtpLoginRequest;
import com.localproblems.os.dto.request.SendOtpRequest;
import com.localproblems.os.dto.request.VerifyOtpRequest;
import com.localproblems.os.dto.response.AuthResponse;
import com.localproblems.os.dto.response.OtpResponse;
import com.localproblems.os.entity.User;
import com.localproblems.os.repository.UserRepository;
import com.localproblems.os.security.JwtTokenProvider;
import com.localproblems.os.service.OtpService;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/otp")
public class OtpController {
    
    private static final Logger log = LoggerFactory.getLogger(OtpController.class);

    private final OtpService otpService;
    private final UserRepository userRepository;
    private final JwtTokenProvider tokenProvider;
    
    @Autowired
    public OtpController(OtpService otpService, UserRepository userRepository, JwtTokenProvider tokenProvider) {
        this.otpService = otpService;
        this.userRepository = userRepository;
        this.tokenProvider = tokenProvider;
    }

    /**
     * Send OTP to phone number
     * POST /api/otp/send
     */
    @PostMapping("/send")
    public ResponseEntity<OtpResponse> sendOtp(@Valid @RequestBody SendOtpRequest request) {
        log.info("OTP request for phone: {}", maskPhone(request.getPhoneNumber()));

        // Check if user exists with this phone number
        if (!userRepository.existsByPhone(request.getPhoneNumber())) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(OtpResponse.failure("No account found with this phone number"));
        }

        // Default to SMS if channel not specified
        String channel = request.getChannel() != null ? request.getChannel() : "sms";

        boolean sent = otpService.sendOtp(request.getPhoneNumber(), channel);

        if (sent) {
            return ResponseEntity.ok(OtpResponse.success(
                "OTP sent successfully to " + maskPhone(request.getPhoneNumber()),
                otpService.getExpiryMinutes()
            ));
        } else {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(OtpResponse.failure("Failed to send OTP. Please try again."));
        }
    }

    /**
     * Verify OTP (without login)
     * POST /api/otp/verify
     */
    @PostMapping("/verify")
    public ResponseEntity<OtpResponse> verifyOtp(@Valid @RequestBody VerifyOtpRequest request) {
        log.info("OTP verification for phone: {}", maskPhone(request.getPhoneNumber()));

        boolean verified = otpService.verifyOtp(request.getPhoneNumber(), request.getOtp());

        if (verified) {
            return ResponseEntity.ok(OtpResponse.success("OTP verified successfully", null));
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(OtpResponse.failure("Invalid or expired OTP"));
        }
    }

    /**
     * Login with OTP (send OTP + verify in one flow)
     * POST /api/otp/login
     */
    @PostMapping("/login")
    public ResponseEntity<?> loginWithOtp(@Valid @RequestBody OtpLoginRequest request) {
        log.info("OTP login attempt for phone: {}", maskPhone(request.getPhoneNumber()));

        // Verify OTP
        boolean verified = otpService.verifyOtp(request.getPhoneNumber(), request.getOtp());

        if (!verified) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(OtpResponse.failure("Invalid or expired OTP"));
        }

        // Find user by phone number
        User user = userRepository.findByPhone(request.getPhoneNumber())
            .orElseThrow(() -> new RuntimeException("User not found"));

        // Generate JWT token
        String token = tokenProvider.generateToken(user.getId());
        
        // Calculate token expiry in seconds (24 hours = 86400 seconds)
        Long expiresIn = 86400L;

        // Return auth response with correct constructor
        AuthResponse response = new AuthResponse(
            token,
            user.getId(),
            user.getEmail(),
            user.getRole().name(),
            expiresIn
        );

        log.info("User {} logged in successfully via OTP", user.getId());
        return ResponseEntity.ok(response);
    }

    /**
     * Request OTP for login (step 1 of OTP login)
     * POST /api/otp/request-login
     */
    @PostMapping("/request-login")
    public ResponseEntity<OtpResponse> requestLoginOtp(@Valid @RequestBody SendOtpRequest request) {
        log.info("Login OTP request for phone: {}", maskPhone(request.getPhoneNumber()));

        // Check if user exists
        if (!userRepository.existsByPhone(request.getPhoneNumber())) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(OtpResponse.failure("No account found with this phone number. Please register first."));
        }

        // Send OTP
        String channel = request.getChannel() != null ? request.getChannel() : "sms";
        boolean sent = otpService.sendOtp(request.getPhoneNumber(), channel);

        if (sent) {
            return ResponseEntity.ok(OtpResponse.success(
                "OTP sent to your phone. Please enter it to login.",
                otpService.getExpiryMinutes()
            ));
        } else {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(OtpResponse.failure("Failed to send OTP. Please try again."));
        }
    }

    /**
     * Check if OTP is enabled
     * GET /api/otp/enabled
     */
    @GetMapping("/enabled")
    public ResponseEntity<java.util.Map<String, Object>> isOtpEnabled() {
        java.util.Map<String, Object> response = new java.util.HashMap<>();
        response.put("enabled", otpService.isOtpEnabled());
        response.put("expiryMinutes", otpService.getExpiryMinutes());
        return ResponseEntity.ok(response);
    }

    /**
     * Mask phone number for security
     */
    private String maskPhone(String phone) {
        if (phone == null || phone.length() < 4) return "****";
        return phone.substring(0, 2) + "****" + phone.substring(phone.length() - 2);
    }
}
