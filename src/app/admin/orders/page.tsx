"use client";
import CommonButton from "@/components/common/CommonButton";
import CommonInput from "@/components/common/CommonInput";
import CommonLoader from "@/components/common/CommonLoader";
import CommonPopconfirm from "@/components/common/CommonPopconfirm";
import CommonTag from "@/components/common/CommonTag";
import { ColumnSortConfig } from "@/interfaces/commonInterace";
import {
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
import { FaEye } from "react-icons/fa6";
import ViewOrderDetailModal from "./ViewOrderDetailModal";

const page = () => {
  const router = useRouter();
  const [request, { isLoading }] = useRequestMutation();

  const [loading, setLoading] = useState<boolean>(false);
  const [timeoutId, setTimeoutId] = useState<any>();

  const [sortedInfo, setSortedInfo] = useState<ColumnSortConfig>();
  const [pageSize, setPageSize] = useState<number>(20);
  const [page, setpage] = useState<number>(1);
  const [TotalData, setTotalData] = useState<number>(0);
  const [totalCountOfFilter, setTotalCountOfFilter] = useState<number>(0);
  const [categories, setCategories] = useState<OrderListItem[]>([]);
  const [SearchText, setSearchText] = useState<string>("");

  const [orderDetails, setOrderDetails] = useState<OrderDetailData | null>(
    null
  );
  const [isModalopens, setisModalopens] = useState<boolean>(false);

  const handleChange = (pagination: any, filters: any, sorter: any) => {
    setSortedInfo(sorter);
    setPageSize(pagination?.pageSize);
    setpage(pagination?.current);
  };

  const fetchGridData = async () => {
    try {
      setLoading(true);
      const payload = {
        search: SearchText,
        page: page,
        pagesize: pageSize,
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
      render: (status) => (
        <CommonTag value={status} colorMap={orderStatusColors} />
      ),
    },
    {
      title: "Payment Status",
      dataIndex: "paymentStatus",
      key: "paymentStatus",
      render: (status) => (
        <CommonTag value={status} colorMap={paymentStatusColors} />
      ),
    },

    {
      title: "Username",
      dataIndex: "username",
      key: "username",
      sorter: (a, b) => a.username.localeCompare(b.username),
      render: (text) => (
        <span className="text-zinc-100 font-medium tracking-wide">{text}</span>
      ),
    },

    {
      title: "Email",
      dataIndex: "useremail",
      key: "useremail",
      sorter: (a, b) => a.useremail.localeCompare(b.useremail),
      render: (text) => <span className="text-zinc-400 text-sm">{text}</span>,
    },

    {
      title: "Phone",
      dataIndex: "phone",
      key: "phone",
      sorter: (a, b) => a.phone.localeCompare(b.phone),
      render: (text) => <span className="text-zinc-300">{text}</span>,
    },

    // {
    //   title: "Total Amount",
    //   dataIndex: "totalAmount",
    //   key: "totalAmount",
    //   sorter: (a, b) => a.totalAmount - b.totalAmount,
    //   render: (value) => `₹ ${value?.toFixed(2)}`,
    // },

    {
      title: "Final Amount",
      dataIndex: "finalAmount",
      key: "finalAmount",
      sorter: (a, b) => a.finalAmount - b.finalAmount,
      render: (value) => `₹ ${value?.toFixed(2)}`,
    },

    {
      title: "Order Date",
      dataIndex: "createdAt",
      key: "createdAt",
      sorter: (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
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
              placeholder="Search order..."
              value={SearchText}
              onChange={(e) => setSearchText(e.target.value)}
              focusColor="blue"
            />
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
      />
    </>
  );
};

export default page;
