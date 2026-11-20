package com.localproblems.os.service;

import com.localproblems.os.entity.Issue;
import com.localproblems.os.repository.IssueRepository;
import com.localproblems.os.util.GeoUtils;
import org.apache.commons.text.similarity.LevenshteinDistance;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.Duration;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class DuplicateDetectionService {
    
    @Autowired
    private IssueRepository issueRepository;
    
    @Value("${app.duplicate-detection.distance-threshold-meters}")
    private double distanceThreshold;
    
    @Value("${app.duplicate-detection.similarity-threshold}")
    private double similarityThreshold;
    
    private static final LevenshteinDistance levenshteinDistance = new LevenshteinDistance();
    
    public DuplicateDetectionResult detectDuplicate(
            Double latitude,
            Double longitude,
            Long categoryId,
            String description) {
        
        // Find nearby issues with same category and active statuses
        String[] activeStatuses = {"OPEN", "ASSIGNED", "IN_PROGRESS"};
        List<Issue> nearbyIssues = issueRepository.findNearbyIssuesByCategoryAndStatus(
                latitude,
                longitude,
                distanceThreshold,
                categoryId,
                activeStatuses
        );
        
        if (nearbyIssues.isEmpty()) {
            return DuplicateDetectionResult.noDuplicate();
        }
        
        // Calculate similarity scores and find best match
        Issue bestMatch = null;
        double bestScore = 0.0;
        
        for (Issue candidate : nearbyIssues) {
            double score = calculateSimilarityScore(
                    latitude, longitude, description, candidate
            );
            
            if (score > bestScore) {
                bestScore = score;
                bestMatch = candidate;
            }
        }
        
        // Check if best match exceeds threshold
        if (bestScore >= similarityThreshold) {
            return DuplicateDetectionResult.duplicate(bestMatch, bestScore);
        }
        
        return DuplicateDetectionResult.noDuplicate();
    }
    
    /**
     * Calculate similarity score (0.0 to 1.0)
     * Components:
     * - Distance proximity: 50% weight
     * - Text similarity: 30% weight
     * - Time proximity: 20% weight
     */
    private double calculateSimilarityScore(
            Double lat, Double lng, String description, Issue candidate) {
        
        // Distance score (closer = higher score)
        double distance = GeoUtils.calculateDistance(
                lat, lng,
                candidate.getLatitude().doubleValue(), candidate.getLongitude().doubleValue()
        );
        double distanceScore = Math.max(0, 1.0 - (distance / distanceThreshold));
        
        // Text similarity score
        double textScore = calculateTextSimilarity(
                description,
                candidate.getDescriptionSummary()
        );
        
        // Time proximity score
        long hoursSinceCreation = Duration.between(
                candidate.getCreatedAt(),
                LocalDateTime.now()
        ).toHours();
        
        double timeScore = hoursSinceCreation <= 24 ? 1.0 :
                hoursSinceCreation <= 72 ? 0.7 :
                        hoursSinceCreation <= 168 ? 0.4 : 0.2;
        
        // Weighted combination
        return (distanceScore * 0.50) + (textScore * 0.30) + (timeScore * 0.20);
    }
    
    /**
     * Calculate text similarity using Levenshtein distance
     */
    private double calculateTextSimilarity(String text1, String text2) {
        if (text1 == null || text2 == null) {
            return 0.0;
        }
        
        String t1 = text1.toLowerCase().trim();
        String t2 = text2.toLowerCase().trim();
        
        if (t1.isEmpty() || t2.isEmpty()) {
            return 0.0;
        }
        
        int distance = levenshteinDistance.apply(t1, t2);
        int maxLen = Math.max(t1.length(), t2.length());
        
        return 1.0 - ((double) distance / maxLen);
    }
    
    // Result class
    public static class DuplicateDetectionResult {
        private final boolean isDuplicate;
        private final Issue matchingIssue;
        private final double similarityScore;
        
        private DuplicateDetectionResult(boolean isDuplicate, Issue matchingIssue, double similarityScore) {
            this.isDuplicate = isDuplicate;
            this.matchingIssue = matchingIssue;
            this.similarityScore = similarityScore;
        }
        
        public static DuplicateDetectionResult noDuplicate() {
            return new DuplicateDetectionResult(false, null, 0.0);
        }
        
        public static DuplicateDetectionResult duplicate(Issue issue, double score) {
            return new DuplicateDetectionResult(true, issue, score);
        }
        
        public boolean isDuplicate() {
            return isDuplicate;
        }
        
        public Issue getMatchingIssue() {
            return matchingIssue;
        }
        
        public double getSimilarityScore() {
            return similarityScore;
        }
    }
}
