package com.localproblems.os.dto.request;

public class UpdateNotificationPreferenceRequest {
    
    private String phoneNumber;
    private Boolean smsEnabled;
    private Boolean whatsappEnabled;
    private Boolean emailEnabled;
    private Boolean webPushEnabled;
    private Boolean notifyIssueCreated;
    private Boolean notifyIssueUpdated;
    private Boolean notifyIssueResolved;
    private Boolean notifyIssueAssigned;
    private Boolean notifyCommentAdded;
    private Boolean notifyCriticalAlerts;
    
    public UpdateNotificationPreferenceRequest() {
    }
    
    public UpdateNotificationPreferenceRequest(String phoneNumber, Boolean smsEnabled, Boolean whatsappEnabled, 
            Boolean emailEnabled, Boolean webPushEnabled, Boolean notifyIssueCreated, Boolean notifyIssueUpdated,
            Boolean notifyIssueResolved, Boolean notifyIssueAssigned, Boolean notifyCommentAdded, Boolean notifyCriticalAlerts) {
        this.phoneNumber = phoneNumber;
        this.smsEnabled = smsEnabled;
        this.whatsappEnabled = whatsappEnabled;
        this.emailEnabled = emailEnabled;
        this.webPushEnabled = webPushEnabled;
        this.notifyIssueCreated = notifyIssueCreated;
        this.notifyIssueUpdated = notifyIssueUpdated;
        this.notifyIssueResolved = notifyIssueResolved;
        this.notifyIssueAssigned = notifyIssueAssigned;
        this.notifyCommentAdded = notifyCommentAdded;
        this.notifyCriticalAlerts = notifyCriticalAlerts;
    }
    
    public String getPhoneNumber() {
        return phoneNumber;
    }
    
    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }
    
    public Boolean getSmsEnabled() {
        return smsEnabled;
    }
    
    public void setSmsEnabled(Boolean smsEnabled) {
        this.smsEnabled = smsEnabled;
    }
    
    public Boolean getWhatsappEnabled() {
        return whatsappEnabled;
    }
    
    public void setWhatsappEnabled(Boolean whatsappEnabled) {
        this.whatsappEnabled = whatsappEnabled;
    }
    
    public Boolean getEmailEnabled() {
        return emailEnabled;
    }
    
    public void setEmailEnabled(Boolean emailEnabled) {
        this.emailEnabled = emailEnabled;
    }
    
    public Boolean getWebPushEnabled() {
        return webPushEnabled;
    }
    
    public void setWebPushEnabled(Boolean webPushEnabled) {
        this.webPushEnabled = webPushEnabled;
    }
    
    public Boolean getNotifyIssueCreated() {
        return notifyIssueCreated;
    }
    
    public void setNotifyIssueCreated(Boolean notifyIssueCreated) {
        this.notifyIssueCreated = notifyIssueCreated;
    }
    
    public Boolean getNotifyIssueUpdated() {
        return notifyIssueUpdated;
    }
    
    public void setNotifyIssueUpdated(Boolean notifyIssueUpdated) {
        this.notifyIssueUpdated = notifyIssueUpdated;
    }
    
    public Boolean getNotifyIssueResolved() {
        return notifyIssueResolved;
    }
    
    public void setNotifyIssueResolved(Boolean notifyIssueResolved) {
        this.notifyIssueResolved = notifyIssueResolved;
    }
    
    public Boolean getNotifyIssueAssigned() {
        return notifyIssueAssigned;
    }
    
    public void setNotifyIssueAssigned(Boolean notifyIssueAssigned) {
        this.notifyIssueAssigned = notifyIssueAssigned;
    }
    
    public Boolean getNotifyCommentAdded() {
        return notifyCommentAdded;
    }
    
    public void setNotifyCommentAdded(Boolean notifyCommentAdded) {
        this.notifyCommentAdded = notifyCommentAdded;
    }
    
    public Boolean getNotifyCriticalAlerts() {
        return notifyCriticalAlerts;
    }
    
    public void setNotifyCriticalAlerts(Boolean notifyCriticalAlerts) {
        this.notifyCriticalAlerts = notifyCriticalAlerts;
    }
}
