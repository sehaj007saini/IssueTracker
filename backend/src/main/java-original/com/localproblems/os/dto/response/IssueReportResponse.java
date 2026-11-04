package com.localproblems.os.dto.response;

public class IssueReportResponse {
    private Long issueId;
    private Long reportId;
    private String status;
    private Boolean isDuplicate;
    private Double similarityScore;
    private String message;
    
    public IssueReportResponse() {
    }
    
    public IssueReportResponse(Long issueId, Long reportId, String status, Boolean isDuplicate, Double similarityScore, String message) {
        this.issueId = issueId;
        this.reportId = reportId;
        this.status = status;
        this.isDuplicate = isDuplicate;
        this.similarityScore = similarityScore;
        this.message = message;
    }
    
    public Long getIssueId() {
        return issueId;
    }
    
    public void setIssueId(Long issueId) {
        this.issueId = issueId;
    }
    
    public Long getReportId() {
        return reportId;
    }
    
    public void setReportId(Long reportId) {
        this.reportId = reportId;
    }
    
    public String getStatus() {
        return status;
    }
    
    public void setStatus(String status) {
        this.status = status;
    }
    
    public Boolean getIsDuplicate() {
        return isDuplicate;
    }
    
    public void setIsDuplicate(Boolean isDuplicate) {
        this.isDuplicate = isDuplicate;
    }
    
    public Double getSimilarityScore() {
        return similarityScore;
    }
    
    public void setSimilarityScore(Double similarityScore) {
        this.similarityScore = similarityScore;
    }
    
    public String getMessage() {
        return message;
    }
    
    public void setMessage(String message) {
        this.message = message;
    }
    
    public static IssueReportResponse newIssue(Long issueId, Long reportId) {
        return new IssueReportResponse(
                issueId,
                reportId,
                "OPEN",
                false,
                null,
                "New issue created successfully"
        );
    }
    
    public static IssueReportResponse duplicateIssue(Long issueId, Long reportId, Double similarityScore, String issueStatus) {
        return new IssueReportResponse(
                issueId,
                reportId,
                issueStatus,
                true,
                similarityScore,
                "Report added to existing issue"
        );
    }
}
