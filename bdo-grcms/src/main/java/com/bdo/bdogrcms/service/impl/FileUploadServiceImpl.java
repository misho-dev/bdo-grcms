package com.bdo.bdogrcms.service.impl;

import com.bdo.bdogrcms.model.FileData;
import com.bdo.bdogrcms.repository.FileUploadRepository;
import com.bdo.bdogrcms.service.FileUploadService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.nio.file.Files;
import java.util.Optional;

@Service
public class FileUploadServiceImpl implements FileUploadService {

    @Autowired
    private FileUploadRepository fileUploadRepository;

    private final String FOLDER_PATH = "C:\\dev\\fileSystem\\";



    public String uploadImageToFileSystem(MultipartFile file) throws IOException {
        if (file.isEmpty()) {
            throw new IllegalStateException("Cannot upload an empty file.");
        }

        // Ensure the directory exists
        File directory = new File(FOLDER_PATH);
        if (!directory.exists()) {
            boolean wasDirectoryCreated = directory.mkdirs();
            if (!wasDirectoryCreated) {
                throw new IOException("Failed to create directory for uploads.");
            }
        }

        // Handle potential file naming conflicts
        String originalFilename = file.getOriginalFilename();
        String filePath = FOLDER_PATH + System.currentTimeMillis() + "_" + originalFilename; // Avoids overwriting

        try {
            FileData fileData = fileUploadRepository.save(FileData.builder()
                    .name(originalFilename)
                    .type(file.getContentType())
                    .filePath(filePath)
                    .build());

            file.transferTo(new File(filePath));

            return "File uploaded successfully: " + filePath;
        } catch (IOException e) {
            throw new IOException("Failed to upload file: " + originalFilename, e);
        } catch (Exception e) {
            // Catch any other exceptions that might occur during the database operation
            throw new RuntimeException("Failed to save file data for: " + originalFilename, e);
        }
    }
    public byte[] downloadImageFromFileSystem(String fileName) throws IOException {
        Optional<FileData> fileDataOptional = fileUploadRepository.findByName(fileName);

        if (fileDataOptional.isEmpty()) {
            throw new FileNotFoundException("File not found with name: " + fileName);
        }

        FileData fileData = fileDataOptional.get();
        String filePath = fileData.getFilePath();

        File file = new File(filePath);
        if (!file.exists()) {
            throw new FileNotFoundException("File does not exist at path: " + filePath);
        }

        try {
            return Files.readAllBytes(file.toPath());
        } catch (IOException e) {
            throw new IOException("Failed to read file bytes for: " + fileName, e);
        }
    }

}
