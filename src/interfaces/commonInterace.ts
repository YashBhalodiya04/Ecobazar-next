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

export interface HomeDataResponse {
  slidersData: MainSliderData[];
  categoryData: categoryData[];
  productData: categoryData[];
}

export interface MainSliderData {
  _id: string;
  title: string;
  description: string;
  image: string;
}

export interface categoryData {
  _id: string;
  name: string;
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
