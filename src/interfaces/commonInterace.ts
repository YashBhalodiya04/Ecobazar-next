export interface CommonApiInterface {
  success: boolean;
  message: string;
  data: any;
  status: number;
}

export interface JWtUserInterface {
  id: string;
  email: string;
  isadmin: boolean;
  phone: string;
}

export interface ContexInterface {
  user: JWtUserInterface;
  params: any;
}

export interface HomePageAPIResponse {
  success: boolean;
  message: string;
  data: HomeDataResponse;
  statuscode: number;
}

export interface HomeDataResponse {
  slidersData: MainSliderData[];
  categoryData: categoryData[];
  productData: ProductData[];
}

export interface MainSliderData {
  id: string;
  title: string;
  description: string;
  image: string;
}

export interface categoryData {
  id: string;
  name: string;
  image: string;
}

export interface ProductData {
  id: string;
  name: string;
  price: number;
  rating: number;
  image: string;
}

export interface CommonDeletePayloadInterface {
  categoryid?: string;
  productid?: string;
  id?: string;
}

export interface TableColumn {
  title: string;
  dataIndex: string;
  key: string;
  width?: number;
  className?: string;
  showSorterTooltip?: boolean;
}

export interface ColumnSortConfig {
  column: TableColumn;
  order?: "ascend" | "descend";
  field: string;
  columnKey: string;
}

export interface CommonDropdownAPIResponse {
  success: boolean;
  message: string;
  data: CommonDropdownOptions[];
  status: number;
}

export interface CommonDropdownOptions {
  id?: string;
  value?: string;
}

export interface CommoPayloadGrid {
  page: number;
  pagesize: number;
  search?: string;
}

export interface ContactEmailPayload {
  email: string;
  message: string;
}
