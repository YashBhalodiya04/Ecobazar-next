export interface CommonMasterGetAllPayload {
  search: string;
  page: number;
  pagesize: number;
}

export interface CommonMasterGridAPIResponse {
  success: boolean;
  message: string;
  data: CommonMasterGridData;
  statuscode: number;
}

export interface CommonMasterGridData {
  data: CommonMasterGridRecord[];
  recordsFiltered: number;
  recordsTotal: number;
}

export interface CommonMasterGridRecord {
  masterid: string;
  mastername: string;
  remarks: string;
  subdata: CommonMasterGridSubData[];
}
export interface CommonMasterGridSubData {
  _id: string;
  keyid: string;
  keyvalue: string;
}

export interface CommonMasterPayload {
  masterid: string;
  mastername: string;
  remarks?: string;
  subdata: CommonMasterSubData[];
}

export interface CommonMasterSubData {
  keyid: string;
  keyvalue: string;
}
