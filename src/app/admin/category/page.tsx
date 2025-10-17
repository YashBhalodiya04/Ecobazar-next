"use client";

import React, { useEffect, useState } from "react";
import { Table, Button, Image, Space, Tooltip } from "antd";
import type { ColumnsType } from "antd/es/table";
import { FaEdit, FaTrashAlt, FaPlus } from "react-icons/fa";
import CommonInput from "@/components/common/CommonInput";
import { useRequestMutation } from "@/redux/commonApi";
import {
  CategoryGrigAPIResponse,
  CategoryGrigRecord,
} from "@/interfaces/CategoryInterface";
import { apis } from "@/redux/apiUrls";
import { useRouter } from "next/navigation";
import CommonLoader from "@/components/common/CommonLoader";
import AddCategoryModal from "./AddCategoryModal";
import { CommonApiInterface } from "@/interfaces/commonInterace";
import CommonPopconfirm from "@/components/common/CommonPopconfirm";

const CategoryPage: React.FC = () => {
  const router = useRouter();
  const [request, { isLoading }] = useRequestMutation();

  const [loading, setLoading] = useState<boolean>(false);
  const [timeoutId, setTimeoutId] = useState<any>();

  const [sortedInfo, setSortedInfo] = useState<any>({});
  const [pageSize, setPageSize] = useState<number>(20);
  const [page, setpage] = useState<number>(1);
  const [TotalData, setTotalData] = useState<number>(0);
  const [categories, setCategories] = useState<CategoryGrigRecord[]>([]);
  const [SearchText, setSearchText] = useState<string>("");

  const [isModalOpen, setisModalOpen] = useState<boolean>(false);
  const [editData, setEditData] = useState<CategoryGrigRecord | null>(null);

  useEffect(() => {
    if (!isModalOpen) {
      setEditData(null);
    }
  }, [isModalOpen]);

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
      const response: CategoryGrigAPIResponse = await request({
        url: apis.ADMIN.getCategory,
        method: "POST",
        body: payload,
      }).unwrap();
      if (response?.statuscode === 401) {
        router.push("/login");
      }
      if (response?.success) {
        setCategories(response?.data?.data || []);
        setTotalData(response?.data?.total || 0);
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

  const handleDelete = async (record: CategoryGrigRecord) => {
    setLoading(true);
    const response: CommonApiInterface = await request({
      url: apis.ADMIN.deleteCategory,
      method: "POST",
      body: { categoryid: record.categoryid },
    }).unwrap();
    if (response?.status === 401) {
      router.push("/login");
    }
    if (response?.success) {
      await fetchGridData();
    }
    setLoading(false);
  };

  const columns: ColumnsType<CategoryGrigRecord> = [
    {
      title: "Actions",
      key: "actions",
      width: 150,
      render: (_, record) => (
        <Space>
          <Tooltip title="Edit Category">
            <Button
              icon={<FaEdit />}
              size="small"
              onClick={() => handleEdit(record)}
              className="border border-zinc-700 bg-zinc-800 text-zinc-200 hover:bg-zinc-700 hover:text-white"
            />
          </Tooltip>

          <CommonPopconfirm
            title="Delete Category"
            description={`Are you sure you want to delete ${record.name} category?`}
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
      title: "Category Name",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => a.name.localeCompare(b.name),
      render: (text) => (
        <span className="text-zinc-100 font-medium tracking-wide">{text}</span>
      ),
      showSorterTooltip: false,
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      sorter: (a, b) => a.description.localeCompare(b.description),
      render: (text) => (
        <span className="text-zinc-400 text-sm max-w-xs line-clamp-2">
          {text}
        </span>
      ),
      showSorterTooltip: false,
    },
    {
      title: "Image",
      dataIndex: "image",
      key: "image",
      width: 200,
      className: "flex justify-center",
      render: (url) => (
        <div className="flex justify-center ">
          <Image
            src={url}
            alt="Category"
            width={80}
            height={60}
            className="rounded-md border border-zinc-700 object-cover"
            preview={true}
          />
        </div>
      ),
    },
  ];

  const handleEdit = (record: CategoryGrigRecord) => {
    setEditData(record);
    setisModalOpen(true);
  };

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
              placeholder="Search category..."
              value={SearchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
          </div>

          <div className="flex justify-end  sm:w-auto mt-3">
            <Button
              icon={<FaPlus />}
              type="primary"
              className="bg-blue-600 hover:bg-blue-500 text-white border-none flex items-center justify-center gap-2 px-4 py-2 rounded-md"
              onClick={() => setisModalOpen(true)}
            >
              Add Category
            </Button>
          </div>
        </div>

        <Table
          columns={columns}
          dataSource={categories}
          onChange={handleChange}
          rowKey="categoryid"
          rowClassName={(record: any, index: number) => {
            return index % 2 === 0 ? "odd-row" : "even-row";
          }}
          className="custom-ant-table-new"
          pagination={{
            position: ["bottomRight"],
            pageSize: pageSize,
            showSizeChanger: true,
            responsive: true,
            showTotal: (total, range) => {
              return (
                <span className="pagination-text">
                  Showing {range[0]}-{range[1]} of {total} entries
                </span>
              );
            },
            total: TotalData,
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
      <AddCategoryModal
        isModalOpen={isModalOpen}
        setIsModalOpen={setisModalOpen}
        ferchGridData={fetchGridData}
        setLoading={setLoading}
        editData={editData}
      />
    </>
  );
};

export default CategoryPage;
