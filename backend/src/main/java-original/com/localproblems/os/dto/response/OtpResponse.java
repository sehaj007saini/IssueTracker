package com.localproblems.os.dto.response;

public class OtpResponse {
    private boolean success;
    private String message;
    private Integer expiryMinutes;
    
    public OtpResponse() {
    }
    
    public OtpResponse(boolean success, String message, Integer expiryMinutes) {
        this.success = success;
        this.message = message;
        this.expiryMinutes = expiryMinutes;
    }
    
    public boolean isSuccess() {
        return success;
    }
    
    public void setSuccess(boolean success) {
        this.success = success;
    }
    
    public String getMessage() {
        return message;
    }
    
    public void setMessage(String message) {
        this.message = message;
    }
    
    public Integer getExpiryMinutes() {
        return expiryMinutes;
    }
    
    public void setExpiryMinutes(Integer expiryMinutes) {
        this.expiryMinutes = expiryMinutes;
    }
    
    public static OtpResponse success(String message, Integer expiryMinutes) {
        return new OtpResponse(true, message, expiryMinutes);
    }
    
    public static OtpResponse failure(String message) {
        return new OtpResponse(false, message, null);
    }
}
