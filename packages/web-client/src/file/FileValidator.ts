export interface FileConstraints {
  /** Max allowed file size in bytes. */
  maxSizeBytes?: number;
  /** Allowed MIME types e.g. ["image/png", "image/jpeg"]. */
  allowedMimeTypes?: string[];
  /** Allowed extensions without dot e.g. ["png", "jpg", "pdf"]. */
  allowedExtensions?: string[];
}

export interface FileValidationResult {
  readonly valid: boolean;
  readonly errors: string[];
}

export function validateFile(file: File, constraints: FileConstraints): FileValidationResult {
  const errors: string[] = [];

  if (constraints.maxSizeBytes != null && file.size > constraints.maxSizeBytes) {
    const maxMb = (constraints.maxSizeBytes / (1024 * 1024)).toFixed(1);
    errors.push(`File size exceeds the maximum allowed size of ${maxMb} MB`);
  }

  if (constraints.allowedMimeTypes && !constraints.allowedMimeTypes.includes(file.type)) {
    errors.push(`File type "${file.type}" is not allowed`);
  }

  if (constraints.allowedExtensions) {
    const ext = file.name.split(".").pop()?.toLowerCase() ?? "";
    if (!constraints.allowedExtensions.includes(ext)) {
      errors.push(`File extension ".${ext}" is not allowed`);
    }
  }

  return { valid: errors.length === 0, errors };
}

export function validateFiles(
  files: File[],
  constraints: FileConstraints
): FileValidationResult {
  const errors = files.flatMap((f) => validateFile(f, constraints).errors);
  return { valid: errors.length === 0, errors };
}

// --- Common constraint presets ---

export const IMAGE_CONSTRAINTS: FileConstraints = {
  maxSizeBytes: 10 * 1024 * 1024, // 10 MB
  allowedMimeTypes: ["image/jpeg", "image/png", "image/webp", "image/gif"],
  allowedExtensions: ["jpg", "jpeg", "png", "webp", "gif"],
};

export const DOCUMENT_CONSTRAINTS: FileConstraints = {
  maxSizeBytes: 25 * 1024 * 1024, // 25 MB
  allowedMimeTypes: ["application/pdf", "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document"],
  allowedExtensions: ["pdf", "doc", "docx"],
};

export const CSV_CONSTRAINTS: FileConstraints = {
  maxSizeBytes: 5 * 1024 * 1024, // 5 MB
  allowedMimeTypes: ["text/csv", "text/plain"],
  allowedExtensions: ["csv"],
};
