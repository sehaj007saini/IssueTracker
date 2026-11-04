package com.localproblems.os.controller;

import com.localproblems.os.dto.request.CreateIssueReportRequest;
import com.localproblems.os.dto.response.IssueReportResponse;
import com.localproblems.os.security.UserPrincipal;
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
    
    @PostMapping
    public ResponseEntity<IssueReportResponse> createIssueReport(
            @Valid @ModelAttribute CreateIssueReportRequest request,
            @RequestParam(value = "photo", required = false) MultipartFile photo,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        
        IssueReportResponse response = issueService.createIssueReport(request, photo, currentUser.getId());
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
}
