package com.localproblems.os.dto.response;

import java.util.List;

public class FraudCheckResponse {
    
    private boolean isValid;
    private int score;
    private List<String> blockers;
    private List<String> warnings;
    private List<String> passedChecks;
    private int userReputationScore;
    
    public FraudCheckResponse() {
    }
    
    private FraudCheckResponse(Builder builder) {
        this.isValid = builder.isValid;
        this.score = builder.score;
        this.blockers = builder.blockers;
        this.warnings = builder.warnings;
        this.passedChecks = builder.passedChecks;
        this.userReputationScore = builder.userReputationScore;
    }
    
    public static Builder builder() {
        return new Builder();
    }
    
    public boolean isValid() {
        return isValid;
    }
    
    public int getScore() {
        return score;
    }
    
    public List<String> getBlockers() {
        return blockers;
    }
    
    public List<String> getWarnings() {
        return warnings;
    }
    
    public List<String> getPassedChecks() {
        return passedChecks;
    }
    
    public int getUserReputationScore() {
        return userReputationScore;
    }
    
    public static class Builder {
        private boolean isValid;
        private int score;
        private List<String> blockers;
        private List<String> warnings;
        private List<String> passedChecks;
        private int userReputationScore;
        
        public Builder isValid(boolean isValid) {
            this.isValid = isValid;
            return this;
        }
        
        public Builder score(int score) {
            this.score = score;
            return this;
        }
        
        public Builder blockers(List<String> blockers) {
            this.blockers = blockers;
            return this;
        }
        
        public Builder warnings(List<String> warnings) {
            this.warnings = warnings;
            return this;
        }
        
        public Builder passedChecks(List<String> passedChecks) {
            this.passedChecks = passedChecks;
            return this;
        }
        
        public Builder userReputationScore(int userReputationScore) {
            this.userReputationScore = userReputationScore;
            return this;
        }
        
        public FraudCheckResponse build() {
            return new FraudCheckResponse(this);
        }
    }
}
