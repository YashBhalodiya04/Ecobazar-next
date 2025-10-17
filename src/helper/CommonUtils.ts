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

  if (files.length === 0) {
    return { data, files };
  }

  for (const f of filesRaw) {
    if (!(f instanceof File))
      throw new Error(`Value for key "${fileKey}" is not a File`);
    files.push(f);
  }

  return { data, files };
}

export const isRestrictedFile = (filePath: any) => {
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
