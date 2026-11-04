package com.localproblems.os.repository;

import com.localproblems.os.entity.IssueComment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface IssueCommentRepository extends JpaRepository<IssueComment, Long> {
    
    List<IssueComment> findByIssue_IdOrderByCreatedAtAsc(Long issueId);
    
    List<IssueComment> findByIssue_IdAndParentIsNullOrderByCreatedAtAsc(Long issueId);
    
    long countByIssue_Id(Long issueId);
}
