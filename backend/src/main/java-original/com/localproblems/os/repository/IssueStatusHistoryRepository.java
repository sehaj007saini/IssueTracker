package com.localproblems.os.repository;

import com.localproblems.os.entity.IssueStatusHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface IssueStatusHistoryRepository extends JpaRepository<IssueStatusHistory, Long> {
    
    List<IssueStatusHistory> findByIssue_IdOrderByChangedAtDesc(Long issueId);
}
