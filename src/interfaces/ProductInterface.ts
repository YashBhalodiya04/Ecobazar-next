export interface ProductGetAllPayload {
  page: number;
  pagesize: number;
  search: string;
  sorting: "ASE" | "DESC";
  categoryid: string;
  minprice: string;
  maxprice: string;
}

export interface ProductCreatePayload {
  name: string;
  description: string;
  price: number;
  imagepath: string;
  categoryid: string;
  stock: number;
  productid: string
}
