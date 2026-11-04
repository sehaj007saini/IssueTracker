package com.localproblems.os.repository;

import com.localproblems.os.entity.IssueReport;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface IssueReportRepository extends JpaRepository<IssueReport, Long> {
    
    List<IssueReport> findByIssue_Id(Long issueId);
    
    List<IssueReport> findByReporter_Id(Long reporterId);
    
    boolean existsByIssue_IdAndReporter_Id(Long issueId, Long reporterId);
}
