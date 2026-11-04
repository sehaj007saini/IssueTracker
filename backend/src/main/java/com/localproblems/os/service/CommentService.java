package com.localproblems.os.service;

import com.localproblems.os.entity.Issue;
import com.localproblems.os.entity.IssueComment;
import com.localproblems.os.entity.Notification;
import com.localproblems.os.entity.User;
import com.localproblems.os.exception.ResourceNotFoundException;
import com.localproblems.os.repository.IssueCommentRepository;
import com.localproblems.os.repository.IssueRepository;
import com.localproblems.os.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class CommentService {
    
    @Autowired
    private IssueCommentRepository commentRepository;
    
    @Autowired
    private IssueRepository issueRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private NotificationService notificationService;
    
    @Transactional
    public IssueComment addComment(Long issueId, Long userId, String commentText, Long parentId) {
        Issue issue = issueRepository.findById(issueId)
                .orElseThrow(() -> new ResourceNotFoundException("Issue not found"));
        
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        
        IssueComment comment = new IssueComment();
        comment.setIssue(issue);
        comment.setUser(user);
        comment.setComment(commentText);
        
        if (parentId != null) {
            IssueComment parent = commentRepository.findById(parentId)
                    .orElseThrow(() -> new ResourceNotFoundException("Parent comment not found"));
            comment.setParent(parent);
        }
        
        comment = commentRepository.save(comment);
        
        // Send notification to issue reporter and other participants
        // (Simplified - in production, notify all unique users who commented)
        if (issue.getAssignedOfficer() != null && !issue.getAssignedOfficer().getId().equals(userId)) {
            notificationService.createNotification(
                issue.getAssignedOfficer(),
                Notification.NotificationType.ISSUE_COMMENT,
                "New comment on issue #" + issueId,
                user.getName() + " commented: " + commentText,
                issueId
            );
        }
        
        return comment;
    }
    
    public List<IssueComment> getCommentsByIssue(Long issueId) {
        return commentRepository.findByIssue_IdOrderByCreatedAtAsc(issueId);
    }
    
    public List<IssueComment> getTopLevelComments(Long issueId) {
        return commentRepository.findByIssue_IdAndParentIsNullOrderByCreatedAtAsc(issueId);
    }
    
    @Transactional
    public IssueComment updateComment(Long commentId, String newCommentText) {
        IssueComment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new ResourceNotFoundException("Comment not found"));
        
        comment.setComment(newCommentText);
        comment.setIsEdited(true);
        
        return commentRepository.save(comment);
    }
    
    @Transactional
    public void deleteComment(Long commentId) {
        commentRepository.deleteById(commentId);
    }
    
    public long getCommentCount(Long issueId) {
        return commentRepository.countByIssue_Id(issueId);
    }
}
