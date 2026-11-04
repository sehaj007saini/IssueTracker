package com.localproblems.os.service;

import com.localproblems.os.entity.Issue;
import com.localproblems.os.repository.IssueRepository;
import com.localproblems.os.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class AnalyticsService {
    
    @Autowired
    private IssueRepository issueRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    public Map<String, Object> getSystemAnalytics() {
        Map<String, Object> analytics = new HashMap<>();
        
        List<Issue> allIssues = issueRepository.findAll();
        
        // Basic counts
        analytics.put("totalIssues", allIssues.size());
        analytics.put("openIssues", countByStatus(allIssues, Issue.IssueStatus.OPEN));
        analytics.put("assignedIssues", countByStatus(allIssues, Issue.IssueStatus.ASSIGNED));
        analytics.put("inProgressIssues", countByStatus(allIssues, Issue.IssueStatus.IN_PROGRESS));
        analytics.put("resolvedIssues", countByStatus(allIssues, Issue.IssueStatus.RESOLVED));
        analytics.put("reopenedIssues", countByStatus(allIssues, Issue.IssueStatus.REOPENED));
        
        // Severity breakdown
        Map<String, Long> bySeverity = allIssues.stream()
                .collect(Collectors.groupingBy(
                        issue -> issue.getSeverity().name(),
                        Collectors.counting()
                ));
        analytics.put("issuesBySeverity", bySeverity);
        
        // Status breakdown
        Map<String, Long> byStatus = allIssues.stream()
                .collect(Collectors.groupingBy(
                        issue -> issue.getStatus().name(),
                        Collectors.counting()
                ));
        analytics.put("issuesByStatus", byStatus);
        
        // Category breakdown
        Map<String, Long> byCategory = allIssues.stream()
                .filter(issue -> issue.getCategory() != null)
                .collect(Collectors.groupingBy(
                        issue -> issue.getCategory().getName(),
                        Collectors.counting()
                ));
        analytics.put("issuesByCategory", byCategory);
        
        // Average resolution time (for resolved issues)
        List<Issue> resolvedIssues = allIssues.stream()
                .filter(issue -> issue.getStatus() == Issue.IssueStatus.RESOLVED)
                .toList();
        
        if (!resolvedIssues.isEmpty()) {
            double avgResolutionDays = resolvedIssues.stream()
                    .mapToLong(issue -> ChronoUnit.DAYS.between(
                            issue.getCreatedAt(),
                            issue.getUpdatedAt()
                    ))
                    .average()
                    .orElse(0.0);
            analytics.put("averageResolutionTimeDays", avgResolutionDays);
        } else {
            analytics.put("averageResolutionTimeDays", 0.0);
        }
        
        // Recent activity (last 7 days)
        LocalDateTime weekAgo = LocalDateTime.now().minusDays(7);
        long recentIssues = allIssues.stream()
                .filter(issue -> issue.getCreatedAt().isAfter(weekAgo))
                .count();
        analytics.put("issuesLastWeek", recentIssues);
        
        // User statistics
        analytics.put("totalUsers", userRepository.count());
        
        // Top reported areas (simplified - by ward if available)
        Map<String, Long> byWard = allIssues.stream()
                .filter(issue -> issue.getWard() != null)
                .collect(Collectors.groupingBy(
                        issue -> issue.getWard().getName(),
                        Collectors.counting()
                ));
        analytics.put("issuesByWard", byWard);
        
        return analytics;
    }
    
    private long countByStatus(List<Issue> issues, Issue.IssueStatus status) {
        return issues.stream()
                .filter(issue -> issue.getStatus() == status)
                .count();
    }
    
    public Map<String, Object> getDepartmentAnalytics(Long departmentId) {
        // Similar analytics but filtered by department
        Map<String, Object> analytics = new HashMap<>();
        
        List<Issue> departmentIssues = issueRepository.findAll().stream()
                .filter(issue -> issue.getDepartment() != null && 
                               issue.getDepartment().getId().equals(departmentId))
                .toList();
        
        analytics.put("totalIssues", departmentIssues.size());
        analytics.put("openIssues", countByStatus(departmentIssues, Issue.IssueStatus.OPEN));
        analytics.put("resolvedIssues", countByStatus(departmentIssues, Issue.IssueStatus.RESOLVED));
        
        return analytics;
    }
}
