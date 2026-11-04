package com.localproblems.os.controller;

import com.localproblems.os.service.AnalyticsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/analytics")
public class AnalyticsController {
    
    @Autowired
    private AnalyticsService analyticsService;
    
    @GetMapping
    @PreAuthorize("hasAnyRole('OFFICER', 'ADMIN')")
    public ResponseEntity<Map<String, Object>> getSystemAnalytics() {
        Map<String, Object> analytics = analyticsService.getSystemAnalytics();
        return ResponseEntity.ok(analytics);
    }
    
    @GetMapping("/department/{departmentId}")
    @PreAuthorize("hasAnyRole('OFFICER', 'ADMIN')")
    public ResponseEntity<Map<String, Object>> getDepartmentAnalytics(
            @PathVariable Long departmentId) {
        Map<String, Object> analytics = analyticsService.getDepartmentAnalytics(departmentId);
        return ResponseEntity.ok(analytics);
    }
}
