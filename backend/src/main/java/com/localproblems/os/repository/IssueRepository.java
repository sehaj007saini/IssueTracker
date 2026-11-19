package com.localproblems.os.repository;

import com.localproblems.os.entity.Issue;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface IssueRepository extends JpaRepository<Issue, Long> {
    
    /**
     * Find nearby issues using PostGIS spatial query (simplified for fraud detection)
     * Returns issues within specified radius (in kilometers)
     */
    @Query(value = """
        SELECT i.* FROM issues i
        WHERE ST_DWithin(
            i.location,
            ST_SetSRID(ST_MakePoint(:longitude, :latitude), 4326)::geography,
            :radiusKm * 1000
        )
        ORDER BY ST_Distance(
            i.location,
            ST_SetSRID(ST_MakePoint(:longitude, :latitude), 4326)::geography
        )
        LIMIT 20
        """, nativeQuery = true)
    List<Issue> findNearbyIssues(
        @Param("latitude") Double latitude,
        @Param("longitude") Double longitude,
        @Param("radiusKm") Double radiusKm
    );
    
    /**
     * Find nearby issues using PostGIS spatial query
     * Returns issues within specified radius that match category and statuses
     */
    @Query(value = """
        SELECT i.* FROM issues i
        WHERE i.category_id = :categoryId
        AND i.status = ANY(CAST(:statuses AS issue_status[]))
        AND ST_DWithin(
            i.location,
            ST_SetSRID(ST_MakePoint(:longitude, :latitude), 4326)::geography,
            :radiusMeters
        )
        ORDER BY ST_Distance(
            i.location,
            ST_SetSRID(ST_MakePoint(:longitude, :latitude), 4326)::geography
        )
        """, nativeQuery = true)
    List<Issue> findNearbyIssuesByCategoryAndStatus(
        @Param("latitude") Double latitude,
        @Param("longitude") Double longitude,
        @Param("radiusMeters") Double radiusMeters,
        @Param("categoryId") Long categoryId,
        @Param("statuses") String[] statuses
    );
    
    /**
     * Find all issues by status
     */
    List<Issue> findByStatus(Issue.IssueStatus status);
    
    /**
     * Find issues by department and status
     */
    List<Issue> findByDepartment_IdAndStatus(Long departmentId, Issue.IssueStatus status);
    
    /**
     * Find issues assigned to an officer
     */
    List<Issue> findByAssignedOfficer_Id(Long officerId);
}
