"use client";
import CommonButton from "@/components/common/CommonButton";
import CommonInput from "@/components/common/CommonInput";
import CommonLoader from "@/components/common/CommonLoader";
import {
  ColumnSortConfig,
  CommonApiInterface,
} from "@/interfaces/commonInterace";
import {
  CommonMasterGridAPIResponse,
  CommonMasterGridRecord,
} from "@/interfaces/CommonMasterInterface";
import { apis } from "@/redux/apiUrls";
import { useRequestMutation } from "@/redux/commonApi";
import { Button, Space, Table, TableColumnsType, Tooltip } from "antd";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { FaEye, FaPlus } from "react-icons/fa6";
import AddCommonMasterModal from "./AddCommonMasterModal";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import CommonPopconfirm from "@/components/common/CommonPopconfirm";
import ViewMasterValueModal from "./ViewMasterValueModal";

const CommonMasterPage = () => {
  const router = useRouter();
  const [request, { isLoading }] = useRequestMutation();

  const [loading, setLoading] = useState<boolean>(false);
  const [timeoutId, setTimeoutId] = useState<any>();
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isViewModalOpen, setisViewModalOpen] = useState<boolean>(false);
  const [editData, setEditData] = useState<CommonMasterGridRecord | null>(null);

  const [sortedInfo, setSortedInfo] = useState<ColumnSortConfig>();
  const [pageSize, setPageSize] = useState<number>(20);
  const [page, setpage] = useState<number>(1);
  const [TotalData, setTotalData] = useState<number>(0);
  const [totalCountOfFilter, setTotalCountOfFilter] = useState<number>(0);
  const [categories, setCategories] = useState<CommonMasterGridRecord[]>([]);
  const [SearchText, setSearchText] = useState<string>("");

  useEffect(() => {
    if (!isViewModalOpen && !isModalOpen) {
      setEditData(null);
    }
  }, [isModalOpen, isViewModalOpen]);

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
      const response: CommonMasterGridAPIResponse = await request({
        url: apis.ADMIN.getAllMasterData,
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

  const handleEdit = (record: CommonMasterGridRecord, isview: boolean) => {
    setEditData(record);
    if (isview) {
      setisViewModalOpen(true);
    } else {
      setIsModalOpen(true);
    }
  };

  const handleDelete = async (record: CommonMasterGridRecord) => {
    setLoading(true);
    const response: CommonApiInterface = await request({
      url: apis.ADMIN.deleteMasterData,
      method: "POST",
      body: { id: record?.masterid },
    }).unwrap();
    if (response?.statuscode === 401) {
      router.push("/login");
    }
    if (response?.success) {
      await fetchGridData();
    }
    setLoading(false);
  };

  const columns: TableColumnsType<CommonMasterGridRecord> = [
    {
      title: "Actions",
      key: "actions",
      width: 150,
      render: (_, record) => (
        <Space>
          <Tooltip title="Edit Master">
            <Button
              icon={<FaEdit />}
              size="small"
              onClick={() => handleEdit(record, false)}
              className="border border-zinc-700 bg-zinc-800 text-zinc-200 hover:bg-zinc-700 hover:text-white"
            />
          </Tooltip>
          <Tooltip title="View Master">
            <Button
              icon={<FaEye />}
              size="small"
              onClick={() => handleEdit(record, true)}
              className="border border-zinc-700 bg-zinc-800 text-zinc-200 hover:bg-zinc-700 hover:text-white"
            />
          </Tooltip>

          <CommonPopconfirm
            title="Delete Category"
            description={`Are you sure you want to delete ${record.mastername} Master?`}
            icon={<FaTrashAlt color="red" className="mt-1 me-2" />}
            onConfirm={() => handleDelete(record)}
            okText="Yes"
            cancelText="No"
          >
            <Button
              icon={<FaTrashAlt />}
              size="small"
              danger
              className="border border-red-800 bg-red-900/30 text-red-400 hover:bg-red-800 hover:text-white"
            />
          </CommonPopconfirm>
        </Space>
      ),
    },
    {
      title: "Master Name",
      dataIndex: "mastername",
      key: "mastername",
      sorter: (a, b) => a.mastername.localeCompare(b.mastername),
      showSorterTooltip: false,
    },
    {
      title: "Remarks",
      dataIndex: "remarks",
      key: "remarks",
      sorter: (a, b) => a.remarks.localeCompare(b.remarks),
      showSorterTooltip: false,
      render: (text) => text || "-",
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
              placeholder="Search Master..."
              value={SearchText}
              onChange={(e) => setSearchText(e.target.value)}
              focusColor="blue"
            />
          </div>

          <div className="flex justify-end sm:w-auto mt-3">
            <CommonButton
              themeType="dark"
              icon={<FaPlus />}
              onClick={() => setIsModalOpen(true)}
            >
              Add
            </CommonButton>
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
      <AddCommonMasterModal
        isModalopen={isModalOpen}
        setIsModalopen={setIsModalOpen}
        setLoading={setLoading}
        fetchgridData={fetchGridData}
        editData={editData}
      />
      <ViewMasterValueModal
        isModalOpen={isViewModalOpen}
        setIsModalOpen={setisViewModalOpen}
        masterData={editData}
      />
    </>
  );
};

export default CommonMasterPage;
