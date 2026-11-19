package com.localproblems.os.service;

import com.localproblems.os.dto.request.ValidateIssueRequest;
import com.localproblems.os.dto.response.FraudCheckResponse;
import com.localproblems.os.entity.Issue;
import com.localproblems.os.entity.User;
import com.localproblems.os.repository.IssueRepository;
import com.localproblems.os.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.regex.Pattern;

@Service
public class FraudDetectionService {
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private IssueRepository issueRepository;
    
    private static final Pattern URL_PATTERN = Pattern.compile(
        "(https?://[^\\s]+)", Pattern.CASE_INSENSITIVE);
    
    private static final Pattern PHONE_PATTERN = Pattern.compile(
        "\\b\\d{10,}\\b");
    
    private static final List<String> SPAM_KEYWORDS = List.of(
        "click here", "buy now", "limited offer", "call now", 
        "free money", "winner", "congratulations", "prize", 
        "urgent", "act now", "offer expires"
    );
    
    private static final List<String> PROFANITY_WORDS = List.of(
        "damn", "hell", "stupid", "idiot", "fool", "jerk"
    );
    
    /**
     * Comprehensive fraud detection for issue reports
     */
    public FraudCheckResponse validateIssueReport(ValidateIssueRequest request, Long userId) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new IllegalArgumentException("User not found"));
        
        List<String> blockers = new ArrayList<>();
        List<String> warnings = new ArrayList<>();
        List<String> passed = new ArrayList<>();
        int totalScore = 0;
        int checksCount = 0;
        
        // 1. Content Quality Check
        int contentScore = checkContentQuality(request.getDescription(), blockers, warnings, passed);
        totalScore += contentScore;
        checksCount++;
        
        // 2. Location Validity Check
        int locationScore = checkLocationValidity(
            request.getLatitude(), request.getLongitude(), 
            request.getAccuracy(), blockers, warnings, passed
        );
        totalScore += locationScore;
        checksCount++;
        
        // 3. User Reputation Check
        int reputationScore = checkUserReputation(user, blockers, warnings, passed);
        totalScore += reputationScore;
        checksCount++;
        
        // 4. Rate Limiting Check
        int rateLimitScore = checkRateLimits(user, blockers, warnings, passed);
        totalScore += rateLimitScore;
        checksCount++;
        
        // 5. Duplicate Content Check
        int duplicateScore = checkDuplicateContent(
            request.getDescription(), request.getLatitude(), 
            request.getLongitude(), userId, blockers, warnings, passed
        );
        totalScore += duplicateScore;
        checksCount++;
        
        // 6. Photo Requirements Check
        int photoScore = checkPhotoRequirements(request.isHasPhoto(), blockers, warnings, passed);
        totalScore += photoScore;
        checksCount++;
        
        int averageScore = totalScore / checksCount;
        boolean isValid = blockers.isEmpty() && averageScore >= 60;
        
        return FraudCheckResponse.builder()
            .isValid(isValid)
            .score(averageScore)
            .blockers(blockers)
            .warnings(warnings)
            .passedChecks(passed)
            .userReputationScore(user.getReputationScore())
            .build();
    }
    
    /**
     * Check content quality and detect spam
     */
    private int checkContentQuality(String description, 
                                    List<String> blockers, 
                                    List<String> warnings, 
                                    List<String> passed) {
        int score = 100;
        
        // Length check
        if (description.length() < 20) {
            blockers.add("Description too short (minimum 20 characters required)");
            score -= 40;
        } else if (description.length() < 50) {
            warnings.add("Brief description, consider adding more details");
            score -= 10;
        } else {
            passed.add("Adequate description length");
        }
        
        // Spam keywords
        String lowerDesc = description.toLowerCase();
        long spamCount = SPAM_KEYWORDS.stream()
            .filter(lowerDesc::contains)
            .count();
        
        if (spamCount >= 2) {
            blockers.add("Description contains multiple spam keywords");
            score -= 60;
        } else if (spamCount == 1) {
            warnings.add("Description contains potential spam keyword");
            score -= 20;
        } else {
            passed.add("No spam keywords detected");
        }
        
        // URL detection
        if (URL_PATTERN.matcher(description).find()) {
            blockers.add("Description contains external links");
            score -= 40;
        } else {
            passed.add("No suspicious links found");
        }
        
        // Phone number detection
        if (PHONE_PATTERN.matcher(description).find()) {
            warnings.add("Description contains phone numbers");
            score -= 15;
        }
        
        // Repeated characters
        if (Pattern.compile("(.)\\1{5,}").matcher(description).find()) {
            warnings.add("Excessive repeated characters detected");
            score -= 20;
        }
        
        // All caps check
        long upperCount = description.chars().filter(Character::isUpperCase).count();
        double capsRatio = (double) upperCount / description.length();
        
        if (capsRatio > 0.7 && description.length() > 20) {
            warnings.add("Excessive use of capital letters");
            score -= 15;
        } else {
            passed.add("Proper text formatting");
        }
        
        // Profanity check
        long profanityCount = PROFANITY_WORDS.stream()
            .filter(word -> lowerDesc.contains(word))
            .count();
        
        if (profanityCount > 2) {
            warnings.add("Description contains inappropriate language");
            score -= 25;
        }
        
        // Word diversity
        String[] words = description.toLowerCase().split("\\s+");
        long uniqueWords = java.util.Arrays.stream(words).distinct().count();
        double diversityRatio = (double) uniqueWords / words.length;
        
        if (words.length > 10 && diversityRatio < 0.5) {
            warnings.add("Low word diversity detected");
            score -= 15;
        } else if (words.length > 5) {
            passed.add("Good content diversity");
        }
        
        // Special characters ratio
        long specialChars = description.chars()
            .filter(c -> !Character.isLetterOrDigit(c) && !Character.isWhitespace(c))
            .count();
        double specialRatio = (double) specialChars / description.length();
        
        if (specialRatio > 0.3) {
            warnings.add("High ratio of special characters");
            score -= 20;
        }
        
        return Math.max(0, score);
    }
    
    /**
     * Verify location accuracy and validity
     */
    private int checkLocationValidity(Double latitude, Double longitude, 
                                     Double accuracy,
                                     List<String> blockers, 
                                     List<String> warnings, 
                                     List<String> passed) {
        int score = 100;
        
        // Validate coordinates
        if (Math.abs(latitude) > 90 || Math.abs(longitude) > 180) {
            blockers.add("Invalid GPS coordinates");
            return 0;
        }
        passed.add("Valid GPS coordinates");
        
        // Check for suspicious coordinates (0,0)
        if (latitude == 0.0 && longitude == 0.0) {
            blockers.add("Suspicious coordinates detected (0,0)");
            return 0;
        }
        
        // Check GPS accuracy
        if (accuracy != null) {
            if (accuracy > 100) {
                warnings.add("Low GPS accuracy (>100m)");
                score -= 20;
            } else if (accuracy > 50) {
                warnings.add("Moderate GPS accuracy");
                score -= 10;
            } else {
                passed.add("High GPS accuracy");
            }
        }
        
        // Check service area (India bounding box)
        boolean isInIndia = latitude >= 8 && latitude <= 37 && 
                           longitude >= 68 && longitude <= 97;
        
        if (!isInIndia) {
            warnings.add("Location outside primary service area");
            score -= 30;
        } else {
            passed.add("Location within service area");
        }
        
        return Math.max(0, score);
    }
    
    /**
     * Check user reputation and history
     */
    private int checkUserReputation(User user, 
                                   List<String> blockers, 
                                   List<String> warnings, 
                                   List<String> passed) {
        int score = 100;
        
        // Account age check
        LocalDateTime now = LocalDateTime.now();
        long accountAgeDays = Duration.between(user.getCreatedAt(), now).toDays();
        
        if (accountAgeDays < 1) {
            warnings.add("New account (less than 1 day old)");
            score -= 20;
        } else if (accountAgeDays < 7) {
            warnings.add("Recently created account");
            score -= 10;
        } else {
            passed.add("Established account (" + accountAgeDays + " days)");
        }
        
        // Spam flags check
        if (user.getSpamFlags() >= 5) {
            blockers.add("Account flagged for spam behavior");
            score -= 60;
        } else if (user.getSpamFlags() >= 3) {
            warnings.add("Account has spam warnings");
            score -= 30;
        } else if (user.getSpamFlags() == 0) {
            passed.add("Clean user history");
        }
        
        // Rejection rate check
        if (user.getTotalReports() > 0) {
            double rejectionRate = (double) user.getRejectedReports() / user.getTotalReports();
            
            if (rejectionRate > 0.5) {
                warnings.add("High rejection rate for previous reports");
                score -= 40;
            } else if (rejectionRate > 0.3) {
                warnings.add("Moderate rejection rate");
                score -= 20;
            } else {
                passed.add("Good report acceptance history");
            }
        }
        
        // Reputation score check
        if (user.getReputationScore() < 20) {
            warnings.add("Low reputation score");
            score -= 35;
        } else if (user.getReputationScore() > 70) {
            passed.add("High reputation score - trusted user");
            score += 15; // Bonus for trusted users
        }
        
        // Verification rate bonus
        if (user.getTotalReports() >= 5) {
            double verificationRate = (double) user.getVerifiedReports() / user.getTotalReports();
            if (verificationRate > 0.7) {
                passed.add("High verification rate");
                score += 10;
            }
        }
        
        return Math.max(0, Math.min(score, 120)); // Cap at 120 for trusted users
    }
    
    /**
     * Check rate limits to prevent spam
     */
    private int checkRateLimits(User user, 
                               List<String> blockers, 
                               List<String> warnings, 
                               List<String> passed) {
        int score = 100;
        
        if (user.getLastReportTime() != null) {
            LocalDateTime now = LocalDateTime.now();
            long minutesSinceLastReport = Duration.between(user.getLastReportTime(), now).toMinutes();
            
            if (minutesSinceLastReport < 5) {
                blockers.add("Too many reports in short time (minimum 5 minutes between reports)");
                score -= 60;
            } else if (minutesSinceLastReport < 15) {
                warnings.add("Frequent reporting detected");
                score -= 20;
            } else {
                passed.add("Appropriate reporting frequency");
            }
        }
        
        // Daily limit check
        LocalDateTime now = LocalDateTime.now();
        long accountAgeDays = Duration.between(user.getCreatedAt(), now).toDays();
        int dailyLimit = accountAgeDays < 7 ? 3 : 10;
        
        if (user.getTotalReports() > dailyLimit * accountAgeDays) {
            warnings.add("High reporting volume");
            score -= 25;
        }
        
        return Math.max(0, score);
    }
    
    /**
     * Check for duplicate/similar content
     */
    private int checkDuplicateContent(String description, 
                                     Double latitude, 
                                     Double longitude,
                                     Long userId,
                                     List<String> blockers, 
                                     List<String> warnings, 
                                     List<String> passed) {
        int score = 100;
        
        // Check for template text
        String lowerDesc = description.toLowerCase();
        List<String> templatePhrases = List.of(
            "this is a test", "testing 123", "sample issue", 
            "demo report", "test report", "example"
        );
        
        long templateMatches = templatePhrases.stream()
            .filter(lowerDesc::contains)
            .count();
        
        if (templateMatches > 0) {
            blockers.add("Description appears to be a test/template");
            score -= 50;
        } else {
            passed.add("Original content detected");
        }
        
        // Check for recent reports from same user in same area
        List<Issue> nearbyIssues = issueRepository.findNearbyIssues(
            latitude, longitude, 0.5 // 500m radius
        );
        
        long recentUserReports = nearbyIssues.stream()
            .filter(issue -> {
                LocalDateTime created = issue.getCreatedAt();
                if (created == null) return false;
                long hoursDiff = Duration.between(created, LocalDateTime.now()).toHours();
                return hoursDiff < 24;
            })
            .count();
        
        if (recentUserReports > 0) {
            warnings.add("Similar issue already reported in this area recently");
            score -= 15;
        }
        
        return Math.max(0, score);
    }
    
    /**
     * Check photo requirements
     */
    private int checkPhotoRequirements(boolean hasPhoto,
                                      List<String> blockers, 
                                      List<String> warnings, 
                                      List<String> passed) {
        int score = 100;
        
        if (!hasPhoto) {
            blockers.add("Photo evidence is required");
            score -= 50;
        } else {
            passed.add("Photo evidence provided");
        }
        
        return Math.max(0, score);
    }
    
    /**
     * Update user reputation after report submission
     */
    public void updateUserReputationAfterReport(User user, boolean isAccepted) {
        user.setTotalReports(user.getTotalReports() + 1);
        user.setLastReportTime(LocalDateTime.now());
        
        if (isAccepted) {
            user.setVerifiedReports(user.getVerifiedReports() + 1);
            // Increase reputation
            int newScore = Math.min(100, user.getReputationScore() + 2);
            user.setReputationScore(newScore);
        } else {
            user.setRejectedReports(user.getRejectedReports() + 1);
            // Decrease reputation
            int newScore = Math.max(0, user.getReputationScore() - 5);
            user.setReputationScore(newScore);
        }
        
        userRepository.save(user);
    }
    
    /**
     * Flag user for spam
     */
    public void flagUserForSpam(Long userId) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new IllegalArgumentException("User not found"));
        
        user.setSpamFlags(user.getSpamFlags() + 1);
        user.setReputationScore(Math.max(0, user.getReputationScore() - 10));
        
        // Suspend user if too many spam flags
        if (user.getSpamFlags() >= 5) {
            user.setIsActive(false);
        }
        
        userRepository.save(user);
    }
}
