"use client";
import CommonButton from "@/components/common/CommonButton";
import CommonInput from "@/components/common/CommonInput";
import CommonLoader from "@/components/common/CommonLoader";
import CommonPopconfirm from "@/components/common/CommonPopconfirm";
import { ColumnSortConfig } from "@/interfaces/commonInterace";
import { ProductGrigRecord } from "@/interfaces/ProductInterface";
import { useRequestMutation } from "@/redux/commonApi";
import { Button, Image, Space, Table, Tooltip } from "antd";
import { ColumnsType } from "antd/es/table";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import { FaPlus } from "react-icons/fa6";

const ProductPage: React.FC = () => {
  const router = useRouter();
  const [request, { isLoading }] = useRequestMutation();

  const [loading, setLoading] = useState<boolean>(false);
  const [timeoutId, setTimeoutId] = useState<any>();

  const [sortedInfo, setSortedInfo] = useState<ColumnSortConfig>();
  const [pageSize, setPageSize] = useState<number>(20);
  const [page, setpage] = useState<number>(1);
  const [TotalData, setTotalData] = useState<number>(0);
  const [totalCountOfFilter, setTotalCountOfFilter] = useState<number>(0);
  const [categories, setCategories] = useState<ProductGrigRecord[]>([]);
  const [SearchText, setSearchText] = useState<string>("");

  const [isModalOpen, setisModalOpen] = useState<boolean>(false);
  const [editData, setEditData] = useState<any | null>(null);

  const handleChange = (pagination: any, filters: any, sorter: any) => {
    setSortedInfo(sorter);
    setPageSize(pagination?.pageSize);
    setpage(pagination?.current);
  };

  const columns: ColumnsType<ProductGrigRecord> = [
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
              // onClick={() => handleEdit(record)}
              className="border border-zinc-700 bg-zinc-800 text-zinc-200 hover:bg-zinc-700 hover:text-white"
            />
          </Tooltip>

          <CommonPopconfirm
            title="Delete Category"
            description={`Are you sure you want to delete ${record.name} category?`}
            icon={<FaTrashAlt color="red" className="mt-1 me-2" />}
            onConfirm={() => {}}
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
              focusColor="blue"
            />
          </div>

          <div className="flex justify-end  sm:w-auto mt-3">
            <CommonButton
              themeType="dark"
              icon={<FaPlus />}
              onClick={() => setisModalOpen(true)}
            >
              Add
            </CommonButton>
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
    </>
  );
};

export default ProductPage;
