package com.localproblems.os.repository;

import com.localproblems.os.entity.CitizenVerification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CitizenVerificationRepository extends JpaRepository<CitizenVerification, Long> {
    
    List<CitizenVerification> findByIssue_Id(Long issueId);
    
    boolean existsByIssue_IdAndCitizen_Id(Long issueId, Long citizenId);
}
