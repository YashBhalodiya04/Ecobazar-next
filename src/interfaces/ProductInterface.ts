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
  images: ProductImages[];
  name: string;
  price: number;
  stock: number;
  offer?: ProductOffer;
  additionalInfo: ProductInfoSectionData[];
}

export interface ProductImages {
  id: string;
  url: string;
}

export interface ProductInfoData {
  id?: string;
  label: string;
  value: string;
}

export interface ProductInfoSectionData {
  id?: string;
  title: string;
  fields: ProductInfoData[];
}

export interface getAllProductListpayload {
  page: number;
  pagesize: number;
  search: string;
  categoryid: string[];
  pricerange: string;
  sortby: string;
}

export interface ProductClientGridAPIResponse {
  success: boolean;
  message: string;
  data: ProductClientData;
  statuscode: number;
}

export interface ProductClientData {
  data: ProductClientGridRecord[];
  recordsFiltered: number;
  recordsTotal: number;
}

export interface ProductClientGridRecord {
  name: string;
  price: number;
  stock: number;
  isNew: boolean;
  hasValidOffer: boolean;
  finalPrice: number;
  id: string;
  image: string;
  rating: number;
  reviews: number;
}
