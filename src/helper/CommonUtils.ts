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

  for (const f of filesRaw) {
    if (!(f instanceof File))
      throw new Error(`Value for key "${fileKey}" is not a File`);
    files.push(f);
  }

  return { data, files };
}
