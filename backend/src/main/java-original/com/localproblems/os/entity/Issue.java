package com.localproblems.os.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.locationtech.jts.geom.Point;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "issues")
@EntityListeners(AuditingEntityListener.class)
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Issue {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id", nullable = false)
    private IssueCategory category;
    
    @Column(columnDefinition = "geography(Point, 4326)", nullable = false)
    private Point location;
    
    @Column(nullable = false, precision = 10, scale = 8)
    private BigDecimal latitude;
    
    @Column(nullable = false, precision = 11, scale = 8)
    private BigDecimal longitude;
    
    @Column(length = 500)
    private String address;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ward_id")
    private Ward ward;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "department_id")
    private Department department;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, columnDefinition = "issue_status")
    private IssueStatus status = IssueStatus.OPEN;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, columnDefinition = "severity")
    private Severity severity = Severity.MEDIUM;
    
    @Column(name = "report_count")
    private Integer reportCount = 0;
    
    @Column(name = "support_count")
    private Integer supportCount = 0;
    
    @Column(name = "description_summary", columnDefinition = "TEXT")
    private String descriptionSummary;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "assigned_officer_id")
    private User assignedOfficer;
    
    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @LastModifiedDate
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    public enum IssueStatus {
        OPEN, ASSIGNED, IN_PROGRESS, RESOLUTION_SUBMITTED, 
        UNDER_VERIFICATION, RESOLVED, REOPENED
    }
    
    public enum Severity {
        LOW, MEDIUM, HIGH, CRITICAL
    }
}
