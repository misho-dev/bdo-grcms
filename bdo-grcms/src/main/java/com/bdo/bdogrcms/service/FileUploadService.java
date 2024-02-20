package com.bdo.bdogrcms.service;

import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

public interface FileUploadService {

    public String uploadImageToFileSystem(MultipartFile file) throws IOException;

    public byte[] downloadImageFromFileSystem(String fileName) throws IOException;
}
