"use client";

import React, { useEffect, useState } from "react";
import { Table, Button, Image, Space, Tooltip } from "antd";
import type { ColumnsType } from "antd/es/table";
import { FaEdit, FaTrashAlt, FaPlus } from "react-icons/fa";
import CommonInput from "@/components/common/CommonInput";

interface Category {
  key: string;
  name: string;
  description: string;
  image: string;
}

const CategoryPage: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [SearchText, setSearchText] = useState<string>("");
  const [pageSize, setPageSize] = useState<any>(20);
  const [sortedInfo, setSortedInfo] = useState<any>({});

  const handleChange = (pagination: any, filters: any, sorter: any) => {
    setSortedInfo(sorter);
    setPageSize(pagination?.pageSize);
  };

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setCategories([
        {
          key: "1",
          name: "Organic Fertilizer",
          description: "Eco-friendly and sustainable fertilizer for crops.",
          image: "https://via.placeholder.com/100x70",
        },
        {
          key: "2",
          name: "Chemical Fertilizer",
          description: "High-nutrient synthetic fertilizer for fast growth.",
          image: "https://via.placeholder.com/100x70",
        },
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const columns: ColumnsType<Category> = [
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

          <Tooltip title="Delete Category">
            <Button
              icon={<FaTrashAlt />}
              size="small"
              danger
              onClick={() => handleDelete(record.key)}
              className="border border-red-800 bg-red-900/30 text-red-400 hover:bg-red-800 hover:text-white"
            />
          </Tooltip>
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
      render: (url) => (
        <div className="flex justify-center">
          <Image
            src={url}
            alt="Category"
            width={80}
            height={60}
            className="rounded-md border border-zinc-700 object-cover"
            preview={false}
          />
        </div>
      ),
    },
  ];

  const handleEdit = (record: Category) => {
    console.log("Edit:", record);
  };

  const handleDelete = (key: string) => {
    setCategories(categories.filter((item) => item.key !== key));
  };

  const filteredData = categories?.filter((item) =>
    Object.values(item)
      .join(" ")
      .toLowerCase()
      .includes(SearchText.toLowerCase())
  );

  return (
    <div className="bg-zinc-950 text-zinc-100 p-6 rounded-lg">
      {/* Header */}
      <div className="flex justify-between align-end mb-6">
        {/* 🔍 Search Input - Left Side */}
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

        {/* ➕ Add Button - Right Side */}
        <div className="flex justify-end  sm:w-auto mt-3">
          <Button
            icon={<FaPlus />}
            type="primary"
            className="bg-blue-600 hover:bg-blue-500 text-white border-none flex items-center justify-center gap-2 px-4 py-2 rounded-md"
          >
            Add Category
          </Button>
        </div>
      </div>

      {/* Table */}
      {/* <div className="rounded-xl border border-zinc-800 bg-zinc-900 shadow-md overflow-hidden"> */}
      <Table
        columns={columns}
        dataSource={filteredData}
        // loading={loading}
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
          total: filteredData.length,
          pageSizeOptions: ["10", "20", "50", "100"],
          defaultPageSize: 10,
          defaultCurrent: 1,
        }}
        scroll={{
          // y: windowSize.height - 420,
          x: "max-content",
        }}
      />
      {/* </div> */}
    </div>
  );
};

export default CategoryPage;
