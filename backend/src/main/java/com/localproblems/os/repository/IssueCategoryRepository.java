package com.localproblems.os.repository;

import com.localproblems.os.entity.IssueCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface IssueCategoryRepository extends JpaRepository<IssueCategory, Long> {
    
    List<IssueCategory> findByIsActive(Boolean isActive);
    
    Optional<IssueCategory> findByNameAndIsActive(String name, Boolean isActive);
}
