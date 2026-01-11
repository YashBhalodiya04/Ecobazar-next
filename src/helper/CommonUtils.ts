export const isNullEmpty = (value: any): boolean => {
  if (typeof value === "string" && value?.trim() === "") {
    return true;
  }
  if (typeof value === "object" && Object.keys(value).length === 0) {
    return true;
  }
  if (typeof value === "number" && value === 0) {
    return true;
  }
  if (typeof value === "undefined" || value === null) {
    return true;
  }
  if (Array.isArray(value) && value.length === 0) {
    return true;
  }
  return false;
};

export interface FormDataWithFilesResult<T> {
  data: T;
  files: File[]; // always return an array
}

export function parseFormDataWithFiles<T>(
  formData: FormData,
  jsonKey: string = "data",
  fileKey: string = "files"
): FormDataWithFilesResult<T> {
  // ✅ Parse JSON object
  const jsonData = formData.get(jsonKey);
  if (!jsonData) throw new Error(`No JSON data found with key "${jsonKey}"`);
  const data: T = JSON.parse(jsonData as string) as T;

  // ✅ Parse files (could be empty array)
  const filesRaw = formData.getAll(fileKey);
  const files: File[] = [];
  if (filesRaw.length === 0) {
    return { data, files };
  }

  for (const f of filesRaw) {
    if (f instanceof Blob) {
      files.push(f);
    } else if (typeof f === "string" && f.trim() === "") {
      // ignore empty string
      continue;
    } else {
      throw new Error(`Value for key "${fileKey}" is not a File`);
    }
  }

  return { data, files };
}

export const isRestrictedFile = (
  filePath: any
): { valid: boolean; message: string } => {
  const restrictedWords = [
    "xss",
    "comment",
    "exit",
    "metadata",
    "double",
    "quote",
  ];

  const fileNameWithExt = filePath.split("\\").pop().split("/").pop();

  const nameParts = fileNameWithExt.split(".");
  const fileName = nameParts.slice(0, -1).join(".");

  const containsRestrictedWord = restrictedWords.some((word) =>
    fileName.toLowerCase().includes(word)
  );

  if (containsRestrictedWord) {
    return {
      valid: true,
      message: "This file name is not allowed for upload.",
    };
  }

  if (nameParts.length > 2) {
    return { valid: true, message: "Double extensions are not allowed." };
  }

  return { valid: false, message: "File is valid for upload." };
};

export function getPublicIdFromUrl(url: string): string | null {
  try {
    const parts = url.split("/upload/");
    if (parts.length < 2) return null;
    const path = parts[1].split(".")[0]; // remove file extension
    return path; // e.g., "products/abc123"
  } catch {
    return null;
  }
}

export const getCookieValue = (name: string): string | null => {
  if (typeof document === "undefined") {
    // We're on the server — no access to document.cookie
    return null;
  }

  const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
  return match ? decodeURIComponent(match[2]) : null;
};