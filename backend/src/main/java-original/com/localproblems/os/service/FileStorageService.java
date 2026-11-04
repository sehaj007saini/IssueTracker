package com.localproblems.os.service;

import com.localproblems.os.exception.InvalidFileException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDate;
import java.util.Set;
import java.util.UUID;

@Service
public class FileStorageService {
    
    @Value("${app.file-storage.upload-dir}")
    private String uploadDir;
    
    @Value("${app.file-storage.max-file-size}")
    private long maxFileSize;
    
    private static final Set<String> ALLOWED_EXTENSIONS = Set.of("jpg", "jpeg", "png", "heic");
    
    public String storeFile(MultipartFile file) {
        validateFile(file);
        
        try {
            // Generate unique filename
            String originalFilename = file.getOriginalFilename();
            String extension = getFileExtension(originalFilename);
            String filename = UUID.randomUUID().toString() + "." + extension;
            
            // Create date-based directory structure
            LocalDate today = LocalDate.now();
            Path uploadPath = Paths.get(
                    uploadDir,
                    String.valueOf(today.getYear()),
                    String.format("%02d", today.getMonthValue()),
                    String.format("%02d", today.getDayOfMonth())
            );
            
            Files.createDirectories(uploadPath);
            
            // Save file
            Path targetLocation = uploadPath.resolve(filename);
            Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);
            
            // Return relative path
            return uploadPath.resolve(filename).toString().replace('\\', '/');
            
        } catch (IOException ex) {
            throw new RuntimeException("Failed to store file", ex);
        }
    }
    
    private void validateFile(MultipartFile file) {
        if (file.isEmpty()) {
            throw new InvalidFileException("File is empty");
        }
        
        if (file.getSize() > maxFileSize) {
            throw new InvalidFileException("File size exceeds maximum limit of 5MB");
        }
        
        String originalFilename = file.getOriginalFilename();
        if (originalFilename == null) {
            throw new InvalidFileException("Invalid filename");
        }
        
        String extension = getFileExtension(originalFilename);
        if (!ALLOWED_EXTENSIONS.contains(extension.toLowerCase())) {
            throw new InvalidFileException("File type not allowed. Allowed types: " + ALLOWED_EXTENSIONS);
        }
    }
    
    private String getFileExtension(String filename) {
        if (filename == null || filename.lastIndexOf('.') == -1) {
            throw new InvalidFileException("File has no extension");
        }
        return filename.substring(filename.lastIndexOf('.') + 1);
    }
}
