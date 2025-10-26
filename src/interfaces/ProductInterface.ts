import { UploadFile } from "antd";

export interface ProductGetAllPayload {
  page: number;
  pagesize: number;
  search: string;
  categoryid: string;
}

export interface ProductCreatePayload {
  name: string;
  description: string;
  price: number;
  categoryid: string;
  stock: number;
  productid?: string;
  active: boolean;
  images: ProductImagesPayload[];
  additionalInfo?: ProductInfoSection[];
  offer?: ProductOffer;
}

export interface ProductImagesPayload {
  id: string;
  url: string;
  isMain?: boolean;
}

export interface ProductInfoSection {
  id: string;
  title: string;
  fields: ProductSubFieldData[];
}

export interface ProductSubFieldData {
  id: string;
  label: string;
  value: string;
}

export interface ProductOffer {
  title: string;
  discountPercent: number;
  validUntil: string;
  description?: string;
}
export interface ProductGrigAPIResponse {
  success: boolean;
  message: string;
  data: ProductGrigAPIResponseData;
  statuscode: number;
}

export interface ProductGrigAPIResponseData {
  data: ProductGrigRecord[];
  recordsFiltered: number;
  recordsTotal: number;
}

export interface ProductGrigRecord {
  active: boolean;
  category: string;
  categoryid: string;
  description: string;
  id: string;
  image: string;
  name: string;
  price: number;
  stock: number;
}
