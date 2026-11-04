package com.localproblems.os.repository;

import com.localproblems.os.entity.IssueEvidence;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface IssueEvidenceRepository extends JpaRepository<IssueEvidence, Long> {
    
    List<IssueEvidence> findByIssue_IdOrderByUploadedAtDesc(Long issueId);
    
    List<IssueEvidence> findByIssue_IdAndEvidenceType(Long issueId, IssueEvidence.EvidenceType evidenceType);
}
