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
  imagepath: string;
  categoryid: string;
  stock: number;
  productid: string;
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
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  stock: number;
  active: boolean;
}
