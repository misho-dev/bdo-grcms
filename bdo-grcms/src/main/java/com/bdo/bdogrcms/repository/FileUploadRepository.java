package com.bdo.bdogrcms.repository;

import com.bdo.bdogrcms.model.FileData;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface FileUploadRepository extends JpaRepository<FileData,Integer> {
    Optional<FileData> findByName(String fileName);
}
