export interface CategoryFilePayload {
  file: File; // uploaded file (e.g. image)
}

export interface CategoryCreatePayload extends CategoryFilePayload {
  name: string;
  description: string;
  imagepath: string;
  categoryid: string;
}
