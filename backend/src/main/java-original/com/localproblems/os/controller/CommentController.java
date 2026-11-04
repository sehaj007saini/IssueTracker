package com.localproblems.os.controller;

import com.localproblems.os.entity.IssueComment;
import com.localproblems.os.security.UserPrincipal;
import com.localproblems.os.service.CommentService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/issues/{issueId}/comments")
public class CommentController {
    
    @Autowired
    private CommentService commentService;
    
    @PostMapping
    public ResponseEntity<IssueComment> addComment(
            @PathVariable Long issueId,
            @Valid @RequestBody CommentRequest request,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        
        IssueComment comment = commentService.addComment(
                issueId,
                userPrincipal.getId(),
                request.getComment(),
                request.getParentId()
        );
        
        return new ResponseEntity<>(comment, HttpStatus.CREATED);
    }
    
    @GetMapping
    public ResponseEntity<List<IssueComment>> getComments(@PathVariable Long issueId) {
        List<IssueComment> comments = commentService.getCommentsByIssue(issueId);
        return ResponseEntity.ok(comments);
    }
    
    @PutMapping("/{commentId}")
    public ResponseEntity<IssueComment> updateComment(
            @PathVariable Long commentId,
            @Valid @RequestBody CommentRequest request) {
        
        IssueComment comment = commentService.updateComment(commentId, request.getComment());
        return ResponseEntity.ok(comment);
    }
    
    @DeleteMapping("/{commentId}")
    public ResponseEntity<Void> deleteComment(@PathVariable Long commentId) {
        commentService.deleteComment(commentId);
        return ResponseEntity.noContent().build();
    }
    
    @Data
    static class CommentRequest {
        @NotBlank(message = "Comment cannot be empty")
        private String comment;
        private Long parentId;
    }
}
