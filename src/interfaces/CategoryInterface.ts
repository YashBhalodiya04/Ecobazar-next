export interface CategoryFilePayload {
  file: File; // uploaded file (e.g. image)
}

export interface CategoryCreatePayload extends CategoryFilePayload {
  name: string;
  description: string;
  imagepath: string;
  categoryid: string;
  active: boolean;
}

export interface CategoryGetPayload {
  search: string;
  page: number;
  pagesize: number;
}

export interface CategoryGrigAPIResponse {
  success: boolean;
  message: string;
  data: CategoryGrigAPIResponseData;
  statuscode: number;
}

export interface CategoryGrigAPIResponseData {
  data: CategoryGrigRecord[];
  recordsFiltered: number;
  recordsTotal: number;
}

export interface CategoryGrigRecord {
  categoryid: string;
  active: boolean;
  name: string;
  description: string;
  image: string;
}
