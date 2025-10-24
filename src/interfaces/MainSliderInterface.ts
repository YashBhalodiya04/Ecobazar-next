export interface MainSliderPayload {
  title: string;
  description: string;
  imagepath?: string;
  sliderid?: string;
  fromdate: string;
  todate: string;
  active: boolean;
}

export interface MainSliderGrigAPIResponse {
  success: boolean;
  message: string;
  data: MainSliderGrigAPIResponseData;
  statuscode: number;
}

export interface MainSliderGrigAPIResponseData {
  data: MainSliderGrigRecord[];
  recordsFiltered: number;
  recordsTotal: number;
}

export interface MainSliderGrigRecord {
  sliderid: string;
  active: boolean;
  title: string;
  description: string;
  image: string;
  fromDate: string;
  toDate: string;
}
