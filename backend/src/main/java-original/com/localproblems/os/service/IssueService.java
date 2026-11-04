package com.localproblems.os.service;

import com.localproblems.os.dto.request.CreateIssueReportRequest;
import com.localproblems.os.dto.response.IssueReportResponse;
import com.localproblems.os.entity.*;
import com.localproblems.os.exception.ResourceNotFoundException;
import com.localproblems.os.repository.*;
import com.localproblems.os.util.GeoUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;

@Service
public class IssueService {
    
    @Autowired
    private IssueRepository issueRepository;
    
    @Autowired
    private IssueReportRepository issueReportRepository;
    
    @Autowired
    private IssueCategoryRepository issueCategoryRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private IssueStatusHistoryRepository statusHistoryRepository;
    
    @Autowired
    private DuplicateDetectionService duplicateDetectionService;
    
    @Autowired
    private FileStorageService fileStorageService;
    
    @Transactional
    public IssueReportResponse createIssueReport(
            CreateIssueReportRequest request,
            MultipartFile photo,
            Long reporterId) {
        
        // Validate category
        IssueCategory category = issueCategoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found"));
        
        if (!category.getIsActive()) {
            throw new IllegalArgumentException("Category is not active");
        }
        
        // Get reporter
        User reporter = userRepository.findById(reporterId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        
        // Store photo if provided
        String photoUrl = null;
        if (photo != null && !photo.isEmpty()) {
            photoUrl = fileStorageService.storeFile(photo);
        }
        
        // Check for duplicates
        DuplicateDetectionService.DuplicateDetectionResult duplicateResult =
                duplicateDetectionService.detectDuplicate(
                        request.getLatitude(),
                        request.getLongitude(),
                        request.getCategoryId(),
                        request.getDescription()
                );
        
        if (duplicateResult.isDuplicate()) {
            // Link to existing issue
            Issue existingIssue = duplicateResult.getMatchingIssue();
            
            IssueReport report = new IssueReport();
            report.setIssue(existingIssue);
            report.setReporter(reporter);
            report.setDescription(request.getDescription());
            report.setPhotoUrl(photoUrl);
            report.setIsPrimary(false);
            report.setSimilarityScore(BigDecimal.valueOf(duplicateResult.getSimilarityScore()));
            report.setStatus(IssueReport.ReportStatus.ACTIVE);
            
            IssueReport savedReport = issueReportRepository.save(report);
            
            // Increment report count
            existingIssue.setReportCount(existingIssue.getReportCount() + 1);
            issueRepository.save(existingIssue);
            
            return IssueReportResponse.duplicateIssue(
                    existingIssue.getId(),
                    savedReport.getId(),
                    duplicateResult.getSimilarityScore(),
                    existingIssue.getStatus().name()
            );
        } else {
            // Create new issue
            Issue issue = new Issue();
            issue.setCategory(category);
            issue.setLocation(GeoUtils.createPoint(request.getLatitude(), request.getLongitude()));
            issue.setLatitude(BigDecimal.valueOf(request.getLatitude()));
            issue.setLongitude(BigDecimal.valueOf(request.getLongitude()));
            issue.setAddress(request.getAddress());
            issue.setStatus(Issue.IssueStatus.OPEN);
            issue.setSeverity(category.getSeverityDefault());
            issue.setDescriptionSummary(request.getDescription());
            issue.setReportCount(1);
            issue.setSupportCount(0);
            issue.setDepartment(category.getDepartment());
            
            Issue savedIssue = issueRepository.save(issue);
            
            // Create primary report
            IssueReport report = new IssueReport();
            report.setIssue(savedIssue);
            report.setReporter(reporter);
            report.setDescription(request.getDescription());
            report.setPhotoUrl(photoUrl);
            report.setIsPrimary(true);
            report.setStatus(IssueReport.ReportStatus.ACTIVE);
            
            IssueReport savedReport = issueReportRepository.save(report);
            
            // Create status history
            createStatusHistory(savedIssue, null, Issue.IssueStatus.OPEN, reporter, "Issue created");
            
            return IssueReportResponse.newIssue(savedIssue.getId(), savedReport.getId());
        }
    }
    
    private void createStatusHistory(Issue issue, Issue.IssueStatus fromStatus,
                                      Issue.IssueStatus toStatus, User changedBy, String comment) {
        IssueStatusHistory history = new IssueStatusHistory();
        history.setIssue(issue);
        history.setFromStatus(fromStatus);
        history.setToStatus(toStatus);
        history.setChangedBy(changedBy);
        history.setComment(comment);
        statusHistoryRepository.save(history);
    }
}
