package com.localproblems.os.controller;

import com.localproblems.os.dto.request.CreateIssueReportRequest;
import com.localproblems.os.dto.request.ValidateIssueRequest;
import com.localproblems.os.dto.response.FraudCheckResponse;
import com.localproblems.os.dto.response.IssueReportResponse;
import com.localproblems.os.security.UserPrincipal;
import com.localproblems.os.service.FraudDetectionService;
import com.localproblems.os.service.IssueService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/issues")
public class IssueController {
    
    @Autowired
    private IssueService issueService;
    
    @Autowired
    private FraudDetectionService fraudDetectionService;
    
    @PostMapping("/validate")
    public ResponseEntity<FraudCheckResponse> validateIssueReport(
            @Valid @RequestBody ValidateIssueRequest request,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        
        FraudCheckResponse response = fraudDetectionService.validateIssueReport(request, currentUser.getId());
        return ResponseEntity.ok(response);
    }
    
    @PostMapping
    public ResponseEntity<IssueReportResponse> createIssueReport(
            @Valid @ModelAttribute CreateIssueReportRequest request,
            @RequestParam(value = "photo", required = false) MultipartFile photo,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        
        // Perform fraud check before creating issue
        ValidateIssueRequest validateRequest = new ValidateIssueRequest();
        validateRequest.setDescription(request.getDescription());
        validateRequest.setLatitude(request.getLatitude());
        validateRequest.setLongitude(request.getLongitude());
        validateRequest.setHasPhoto(photo != null && !photo.isEmpty());
        
        FraudCheckResponse fraudCheck = fraudDetectionService.validateIssueReport(
            validateRequest, currentUser.getId());
        
        if (!fraudCheck.isValid()) {
            throw new IllegalArgumentException(
                "Issue validation failed: " + String.join(", ", fraudCheck.getBlockers())
            );
        }
        
        IssueReportResponse response = issueService.createIssueReport(request, photo, currentUser.getId());
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
}
