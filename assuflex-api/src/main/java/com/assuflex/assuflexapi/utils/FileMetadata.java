package com.assuflex.assuflexapi.utils;

import lombok.Builder;
import lombok.Data;
import lombok.RequiredArgsConstructor;

@Data
@RequiredArgsConstructor
@Builder
public class FileMetadata {
    private final Long documentId;
    private final String fileNewName;
    private final String contentType;
    private final String fileUrl;
}
