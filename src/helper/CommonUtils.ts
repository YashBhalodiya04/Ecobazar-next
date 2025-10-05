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
