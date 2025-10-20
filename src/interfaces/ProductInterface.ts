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
  active: boolean;
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
