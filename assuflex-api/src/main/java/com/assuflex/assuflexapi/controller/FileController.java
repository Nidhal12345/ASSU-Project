package com.assuflex.assuflexapi.controller;

import com.assuflex.assuflexapi.utils.FileMetadata;
import com.assuflex.assuflexapi.utils.FileStorageService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class FileController {

    private final FileStorageService fileStorageService;

//    @GetMapping("/user/{documentId}")
//    public ResponseEntity<Resource> downloadFile(@PathVariable Long documentId) {
//        FileStorageService.FileResponse fileResponse = fileStorageService.getFile(documentId);
//        return ResponseEntity.ok()
//                .contentType(fileResponse.getContentType())
//                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + fileResponse.getFileName() + "\"")
//                .body(fileResponse.getResource());
//    }

    @GetMapping("/user/{quoteId}")
    public ResponseEntity<List<FileMetadata>> getAllFilesByUserId(@PathVariable Integer quoteId) {
        List<FileMetadata> metadataList = fileStorageService.getFilesByQuoteId(quoteId);
        return ResponseEntity.ok(metadataList);
    }
}