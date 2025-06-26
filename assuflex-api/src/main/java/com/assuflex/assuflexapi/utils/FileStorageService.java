package com.assuflex.assuflexapi.utils;

import com.assuflex.assuflexapi.model.Contract;
import com.assuflex.assuflexapi.model.Document;
import com.assuflex.assuflexapi.model.Quote;
import com.assuflex.assuflexapi.repository.ContractRepository;
import com.assuflex.assuflexapi.repository.DocumentRepository;
import com.assuflex.assuflexapi.repository.QuoteRepository;
import com.assuflex.assuflexapi.repository.UserRepository;
import com.assuflex.assuflexapi.service.ContractService;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.*;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@Slf4j
@RequiredArgsConstructor
public class FileStorageService {

    private final DocumentRepository documentRepository;

    private final QuoteRepository quoteRepository;

    private final ContractRepository contractRepository;

    public List<String> saveFiles(
            @NonNull MultipartFile[] files,
            @NonNull Integer quoteId
    ) {
        String subPath = "quotes" + File.separator + quoteId;
        List<String> storedPaths = new ArrayList<>();

        Quote quote = quoteRepository.findById(Long.valueOf(quoteId))
                .orElseThrow(() -> new RuntimeException("Contract not found"));

        for (MultipartFile file : files) {
            List<String> path = uploadFile(file, subPath);
            if (path != null) {
                storedPaths.add(path.getFirst());

                Document document = Document.builder()
                        .fileUrl(path.getFirst())
                        .fileNewName(path.getLast())
                        .fileName(file.getOriginalFilename())
                        .quote(quote)
                        .build();

                documentRepository.save(document);
            }
        }

        return storedPaths;
    }

    private List<String> uploadFile(
            @NonNull MultipartFile sourceFile,
            @NonNull String subPath
    ) {
        String fileUploadPath = "./Uploads";
        Path targetDir = Paths.get(fileUploadPath, subPath).toAbsolutePath().normalize();
        try {
            Files.createDirectories(targetDir);
        } catch (IOException e) {
            log.warn("Could not create directory: {}", targetDir, e);
            return null;
        }

        String ext      = getFileExtension(sourceFile.getOriginalFilename());
        String filename = System.currentTimeMillis() + (ext.isEmpty() ? "" : "." + ext);
        Path   target   = targetDir.resolve(filename);

        try {
            Files.write(target, sourceFile.getBytes(), StandardOpenOption.CREATE);
            List<String> storedPaths = new ArrayList<>();
            storedPaths.add(subPath + File.separator + filename);
            storedPaths.add(filename);
            return storedPaths;
        } catch (IOException e) {
            return null;
        }
    }

    private String getFileExtension(String fileName) {
        if (fileName == null) return "";
        int dot = fileName.lastIndexOf('.');
        return (dot < 0) ? "" : fileName.substring(dot + 1).toLowerCase();
    }

    public Map<String,String> savePdfFile(
            @NonNull byte[] pdfBytes,
            @NonNull Integer contractId,
            @NonNull String originalFileName
    ) {
        Map<String,String> arrayPath = new HashMap<>();
        String subPath = "contracts" + File.separator + contractId;

        String storedPath = uploadPdfFile(pdfBytes, subPath, originalFileName);

        if (storedPath != null) {
            String newFileName = Paths.get(storedPath).getFileName().toString();

            arrayPath.put("newFileName",newFileName);
            arrayPath.put("storedPath",storedPath);
            arrayPath.put("originalFileName",originalFileName);

        }

        return arrayPath;
    }

    private String uploadPdfFile(
            @NonNull byte[] pdfBytes,
            @NonNull String subPath,
            @NonNull String originalFileName
    ) {
        String fileUploadPath = "./Uploads";
        Path targetDir = Paths.get(fileUploadPath, subPath).toAbsolutePath().normalize();

        try {
            Files.createDirectories(targetDir);
        } catch (IOException e) {
            log.warn("Could not create directory: {}", targetDir, e);
            return null;
        }

        String filename = System.currentTimeMillis() + ".pdf";
        Path target = targetDir.resolve(filename);

        try {
            Files.write(target, pdfBytes, StandardOpenOption.CREATE);
            log.info("Saved PDF file: {}", target);

            return subPath + File.separator + filename;
        } catch (IOException e) {
            log.warn("Failed to save PDF file {}", filename, e);
            return null;
        }
    }

    public List<FileMetadata> getFilesByQuoteId(Integer quoteId) {
        Quote quote = quoteRepository.findById(Long.valueOf(quoteId))
                .orElseThrow(() -> new RuntimeException("Quote not found"));

        List<Document> documents = documentRepository.findByQuote(quote);
        List<FileMetadata> metadataList = new ArrayList<>();

        String fileUploadPath = "./Uploads";

        for (Document document : documents) {
            Path filePath = Paths.get(fileUploadPath, document.getFileUrl()).toAbsolutePath().normalize();
            try {
                String contentType = Files.probeContentType(filePath);
                if (contentType == null) contentType = "application/octet-stream";

                metadataList.add(FileMetadata.builder()
                        .fileUrl(document.getFileUrl())
                        .fileNewName(document.getFileNewName())
                        .contentType(contentType)
                        .documentId(document.getId())
                        .build());
            } catch (IOException e) {
                log.warn("Failed to retrieve metadata for quote {}: {}", quoteId, filePath, e);
            }
        }

        return metadataList;
    }}