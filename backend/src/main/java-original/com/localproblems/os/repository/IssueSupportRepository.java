package com.localproblems.os.repository;

import com.localproblems.os.entity.IssueSupport;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface IssueSupportRepository extends JpaRepository<IssueSupport, Long> {
    
    boolean existsByIssue_IdAndCitizen_Id(Long issueId, Long citizenId);
    
    long countByIssue_Id(Long issueId);
}
