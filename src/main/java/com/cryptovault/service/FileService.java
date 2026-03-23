package com.cryptovault.service;

import com.cryptovault.entity.FileMetadata;
import com.cryptovault.exception.FileStorageException;
import com.cryptovault.repository.FileMetadataRepository;
import com.cryptovault.util.AESUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class FileService {

    @Autowired
    private FileMetadataRepository fileRepository;

    @Value("${file.upload-dir}")
    private String uploadDir;

    public FileMetadata storeFile(MultipartFile file) throws Exception {
        if (file.isEmpty()) {
            throw new FileStorageException("Failed to store empty file.");
        }
        try {
            byte[] fileBytes = file.getBytes();
            byte[] encryptedBytes = AESUtils.encrypt(fileBytes);

            Path targetPath = Paths.get(uploadDir).toAbsolutePath().normalize();
            if (!Files.exists(targetPath)) {
                Files.createDirectories(targetPath);
            }

            String storedFileName = UUID.randomUUID().toString() + ".enc";
            Path filePath = targetPath.resolve(storedFileName);
            Files.write(filePath, encryptedBytes);

            // Get the logged-in username
            String username = SecurityContextHolder.getContext().getAuthentication().getName();

            FileMetadata metadata = new FileMetadata(
                    file.getOriginalFilename(),
                    filePath.toString(),
                    file.getSize(),
                    LocalDateTime.now()
            );
            metadata.setUploadedBy(username);
            return fileRepository.save(metadata);

        } catch (IOException e) {
            throw new FileStorageException("Could not store file " + file.getOriginalFilename(), e);
        }
    }

    public DecryptedFile getFile(Long id) throws Exception {
        String currentUser = SecurityContextHolder.getContext().getAuthentication().getName();
        boolean isAdmin = SecurityContextHolder.getContext().getAuthentication()
                .getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));

        FileMetadata metadata = fileRepository.findById(id)
                .orElseThrow(() -> new FileStorageException("File not found with id: " + id));

        // Security check: only owner or admin can download
        if (!isAdmin && !metadata.getUploadedBy().equals(currentUser)) {
            throw new FileStorageException("Access denied. You do not own this file.");
        }

        try {
            Path filePath = Paths.get(metadata.getFilePath());
            byte[] encryptedBytes = Files.readAllBytes(filePath);
            byte[] decryptedBytes = AESUtils.decrypt(encryptedBytes);
            return new DecryptedFile(metadata.getFileName(), decryptedBytes);
        } catch (IOException e) {
            throw new FileStorageException("Could not read file for id: " + id, e);
        }
    }

    public List<FileMetadata> getFilesForUser(String username) {
        return fileRepository.findByUploadedBy(username);
    }

    public List<FileMetadata> getAllFiles() {
        return fileRepository.findAll();
    }

    public long getTotalFileCount() {
        return fileRepository.count();
    }

    // Helper class for returning decrypted file data
    public static class DecryptedFile {
        private final String fileName;
        private final byte[] content;

        public DecryptedFile(String fileName, byte[] content) {
            this.fileName = fileName;
            this.content = content;
        }

        public String getFileName() { return fileName; }
        public byte[] getContent() { return content; }
    }
}
