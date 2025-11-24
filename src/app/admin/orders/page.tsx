"use client";
import CommonButton from "@/components/common/CommonButton";
import CommonInput from "@/components/common/CommonInput";
import CommonLoader from "@/components/common/CommonLoader";
import CommonPopconfirm from "@/components/common/CommonPopconfirm";
import CommonTag from "@/components/common/CommonTag";
import { ColumnSortConfig, CommonDropdownOptions } from "@/interfaces/commonInterace";
import {
  CommondropdownData,
  CommondropdownDataAPiresponse,
  OrderDetailData,
  OrderDetailResponse,
  OrderListApiResponse,
  OrderListItem,
  orderStatusColors,
  paymentStatusColors,
} from "@/interfaces/OrdersInterface";
import { apis } from "@/redux/apiUrls";
import { useRequestMutation } from "@/redux/commonApi";
import { Space, Tooltip } from "antd";
import Table, { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { FaEdit } from "react-icons/fa";
import { FaEye, FaFilter } from "react-icons/fa6";
import ViewOrderDetailModal from "./ViewOrderDetailModal";
import CommonPopover from "@/components/common/CommonPopover";
import CommonSelect from "@/components/common/CommonSelect";

const OrderPage = () => {
  const router = useRouter();
  const [request, { isLoading }] = useRequestMutation();

  const [loading, setLoading] = useState<boolean>(false);
  const [timeoutId, setTimeoutId] = useState<any>();

  const [isFirstTime, setisFirstTime] = useState<boolean>(true);

  const [sortedInfo, setSortedInfo] = useState<ColumnSortConfig>();
  const [pageSize, setPageSize] = useState<number>(20);
  const [page, setpage] = useState<number>(1);
  const [TotalData, setTotalData] = useState<number>(0);
  const [totalCountOfFilter, setTotalCountOfFilter] = useState<number>(0);
  const [categories, setCategories] = useState<OrderListItem[]>([]);
  const [SearchText, setSearchText] = useState<string>("");

  const [selectedPaymentStatus, setselectedPaymentStatus] = useState<CommonDropdownOptions>()
  const [selectedOrderStatus, setselectedOrderStatus] = useState<CommonDropdownOptions>()
  const [isFIlterOpen, setisFIlterOpen] = useState<boolean>(false);
  

  const [commonDropdownData, setCommonDropdownData] =
    useState<CommondropdownData | null>(null);

  const [orderDetails, setOrderDetails] = useState<OrderDetailData | null>(
    null
  );
  const [isModalopens, setisModalopens] = useState<boolean>(false);

  const fetchDropdownData = async () => {
    setLoading(true);
    try {
      const payload = {
        type: ["Order Status", "Payment Methods", "Payment Status"],
      };
      const response: CommondropdownDataAPiresponse = await request({
        url: apis.WITHOUTTOKEN.commonDropdown,
        method: "POST",
        body: payload,
      }).unwrap();
      if (response?.success) {
        setCommonDropdownData(response?.data);
      }
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message, true);
      } else {
        console.error("An unknown error occurred", error, true);
      }
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (pagination: any, filters: any, sorter: any) => {
    setSortedInfo(sorter);
    setPageSize(pagination?.pageSize);
    setpage(pagination?.current);
  };

  const fetchGridData = async (isreset?:boolean) => {
    try {
      setLoading(true);
      const payload = {
        search: SearchText,
        page: page,
        pagesize: pageSize,
        paymentstatus: selectedPaymentStatus?.id,
        orderstatus: selectedOrderStatus?.id,
      };
      const response: OrderListApiResponse = await request({
        url: apis.ADMIN.getAllOrder,
        method: "POST",
        body: payload,
      }).unwrap();
      if (response?.statuscode === 401) {
        router.push("/login");
      }
      if (response?.success) {
        setCategories(response?.data?.data || []);
        setTotalData(Number(response?.data?.recordsTotal) || 0);
        setTotalCountOfFilter(Number(response?.data?.recordsFiltered) || 0);
      } else {
        setCategories([]);
        setTotalData(0);
        setTotalCountOfFilter(0);
      }
      if (isFirstTime) {
        await fetchDropdownData();
      }
      setisFirstTime(false);
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message, true);
      } else {
        console.error("An unknown error occurred", error, true);
      }
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    const id = setTimeout(() => {
      fetchGridData();
    }, 400);
    setTimeoutId(id);
    return () => {
      clearTimeout(id);
    };
  }, [SearchText, pageSize, sortedInfo]);

  const fetchOrderDetails = async (orderid: string) => {
    try {
      setLoading(true);
      const payload = {
        id: orderid,
      };
      const response: OrderDetailResponse = await request({
        url: apis.ADMIN.getOrderDetails,
        method: "POST",
        body: payload,
      }).unwrap();

      if (response?.success) {
        setOrderDetails(response?.data);
        setisModalopens(true);
      }
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message, true);
      } else {
        console.error("An unknown error occurred", error, true);
      }
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isModalopens) {
      setOrderDetails(null);
    }
  }, [isModalopens]);

  const columns: ColumnsType<OrderListItem> = [
    {
      title: "Actions",
      key: "actions",
      width: 120,
      render: (_, record) => (
        <Space>
          <Tooltip title="View Order">
            <CommonButton
              icon={<FaEye />}
              size="small"
              onClick={() => fetchOrderDetails(record?._id)}
            />
          </Tooltip>
        </Space>
      ),
    },
    {
      title: "Order Status",
      dataIndex: "orderStatus",
      key: "orderStatus",
      showSorterTooltip: false,
      render: (status) => (
        <CommonTag value={status} colorMap={orderStatusColors} />
      ),
    },
    {
      title: "Payment Status",
      dataIndex: "paymentStatus",
      key: "paymentStatus",
      showSorterTooltip: false,
      render: (status) => (
        <CommonTag value={status} colorMap={paymentStatusColors} />
      ),
    },

    {
      title: "Username",
      dataIndex: "username",
      key: "username",
      showSorterTooltip: false,
      sorter: (a, b) => (a?.username ?? "")?.localeCompare(b?.username ?? ""),
      render: (text) => (
        <span className="text-zinc-100 font-medium tracking-wide">{text}</span>
      ),
    },

    {
      title: "Email",
      dataIndex: "useremail",
      key: "useremail",
      showSorterTooltip: false,
      sorter: (a, b) => (a?.useremail ?? "")?.localeCompare(b?.useremail ?? ""),
      render: (text) => <span className="text-zinc-400 text-sm">{text}</span>,
    },

    {
      title: "Phone",
      dataIndex: "phone",
      key: "phone",
      showSorterTooltip: false,
      sorter: (a, b) => (a?.phone ?? "")?.localeCompare(b?.phone ?? ""),
      render: (text) => <span className="text-zinc-300">{text}</span>,
    },

    {
      title: "Total Amount",
      dataIndex: "totalAmount",
      key: "totalAmount",
      showSorterTooltip: false,
      sorter: (a, b) => (a?.totalAmount ?? 0) - (b?.totalAmount ?? 0),
      render: (value) => `₹ ${value?.toFixed(2)}`,
    },

    {
      title: "Final Amount",
      dataIndex: "finalAmount",
      key: "finalAmount",
      showSorterTooltip: false,
      sorter: (a, b) => (a?.finalAmount ?? 0) - (b?.finalAmount ?? 0),
      render: (value) => `₹ ${value?.toFixed(2)}`,
    },

    {
      title: "Order Date",
      dataIndex: "createdAt",
      key: "createdAt",
      showSorterTooltip: false,
      sorter: (a, b) =>
        new Date(a?.createdAt).getTime() - new Date(b?.createdAt).getTime(),
      render: (date) => (
        <span className="text-zinc-400 text-sm">
          {dayjs(date).format("DD MMM YYYY, hh:mm A")}
        </span>
      ),
    },
  ];

  return (
    <>
      <CommonLoader loading={loading} />
      <div className="bg-zinc-950 text-zinc-100 p-6 rounded-lg">
        <div className="flex justify-between align-end mb-6">
          <div className="w-1/3 sm:w-full">
            <CommonInput
              id="search"
              label=""
              type="text"
              placeholder="Search Product..."
              value={SearchText}
              onChange={(e) => setSearchText(e.target.value)}
              focusColor="blue"
            />
          </div>

          <div className="flex justify-end  sm:w-auto mt-3 gap-2">
            <CommonPopover
              title={
                <span className="text-zinc-300 text-sm">Filter Options</span>
              }
              open={isFIlterOpen}
              setOpen={setisFIlterOpen}
              placement="bottomRight"
              className="my-custom-shadow"
              content={
                <div className="space-y-3 w-64">
                  <div className="flex flex-col">
                    <div className="flex flex-col">
                      <label className="block text-white text-sm mb-2">
                        Payment Status
                      </label>
                      <CommonSelect
                        onChange={(e) => setselectedPaymentStatus(e)}
                        options={commonDropdownData?.PaymentStatus || []}
                        value={selectedPaymentStatus}
                        placeholder="select category"
                        focusColor="blue"
                        labelKey="value"
                        valueKey="id"
                      />
                    </div>
                    <div className="flex flex-col mt-2">
                      <label className="block text-white text-sm mb-2">
                        Order Status
                      </label>
                      <CommonSelect
                        onChange={(e) => setselectedOrderStatus(e)}
                        options={commonDropdownData?.OrderStatus || []}
                        value={selectedOrderStatus}
                        placeholder="select category"
                        focusColor="blue"
                        labelKey="value"
                        valueKey="id"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-2 pt-2">
                    <CommonButton
                      themeType="dark"
                      onClick={() => {
                        setselectedPaymentStatus({});
                        setselectedOrderStatus({});
                        fetchGridData(true);
                      }}
                    >
                      Reset
                    </CommonButton>
                    <CommonButton
                      themeType="primary"
                      onClick={() => fetchGridData()}
                      children="Apply"
                    />
                  </div>
                </div>
              }
            >
              <Tooltip title="Filter Products">
                <CommonButton themeType="dark" icon={<FaFilter />}>
                  Filters
                </CommonButton>
              </Tooltip>
            </CommonPopover>
          </div>
        </div>

        <Table
          columns={columns}
          dataSource={categories}
          onChange={handleChange}
          rowKey="_id"
          rowClassName={(record: any, index: number) => {
            return index % 2 === 0 ? "odd-row" : "even-row";
          }}
          className="ant-table-Main-Grid"
          pagination={{
            position: ["bottomRight"],
            pageSize: pageSize,
            showSizeChanger: true,
            responsive: true,
            showTotal: (total, range) => (
              <span className="pagination-text">
                Showing {range[0]} to {range[1]} of {totalCountOfFilter} entries
                {totalCountOfFilter !== TotalData && (
                  <>(filtered from {TotalData} total entries)</>
                )}
              </span>
            ),
            total: totalCountOfFilter,
            pageSizeOptions: ["10", "20", "50", "100"],
            defaultPageSize: 10,
            defaultCurrent: 1,
            current: page,
          }}
          scroll={{
            x: "max-content",
          }}
        />
      </div>
      <ViewOrderDetailModal
        data={orderDetails}
        isModalopen={isModalopens}
        setIsModalopen={setisModalopens}
        fetchGridData={fetchGridData}
        setLoading={setLoading}
        setOrderDetailData={setOrderDetails}
        commonDropdownData={commonDropdownData}
      />
    </>
  );
};

export default OrderPage;
