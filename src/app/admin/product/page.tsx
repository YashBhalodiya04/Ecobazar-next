"use client";
import CommonButton from "@/components/common/CommonButton";
import CommonInput from "@/components/common/CommonInput";
import CommonLoader from "@/components/common/CommonLoader";
import CommonPopconfirm from "@/components/common/CommonPopconfirm";
import CommonPopover from "@/components/common/CommonPopover";
import CommonSelect from "@/components/common/CommonSelect";
import {
  ColumnSortConfig,
  CommonApiInterface,
  CommonDropdownAPIResponse,
  CommonDropdownOptions,
} from "@/interfaces/commonInterace";
import {
  ProductGrigAPIResponse,
  ProductGrigRecord,
} from "@/interfaces/ProductInterface";
import { apis } from "@/redux/apiUrls";
import { useRequestMutation } from "@/redux/commonApi";
import { Button, Image, Space, Table, Tag, Tooltip } from "antd";
import { ColumnsType } from "antd/es/table";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import { FaFilter, FaPlus } from "react-icons/fa6";
import AddProductModal from "./AddProductModal";

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

  const [isFIlterOpen, setisFIlterOpen] = useState<boolean>(false);
  const [selectedCategory, setselectedCategory] = useState<any>({});
  const [dropdownData, setdropdownData] = useState<CommonDropdownOptions[]>([]);

  const handleChange = (pagination: any, filters: any, sorter: any) => {
    setSortedInfo(sorter);
    setPageSize(pagination?.pageSize);
    setpage(pagination?.current);
  };

  useEffect(() => {
    if (!isModalOpen) {
      setEditData(null);
    }
  }, [isModalOpen]);

  const handleEdit = (record: ProductGrigRecord) => {
    setEditData(record);
    setisModalOpen(true);
  };

  const handleDelete = async (record: ProductGrigRecord) => {
    setLoading(true);
    const response: CommonApiInterface = await request({
      url: apis.ADMIN.deleteProduct,
      method: "POST",
      body: { productid: record.id },
    }).unwrap();
    if (response?.status === 401) {
      router.push("/login");
    }
    if (response?.success) {
      await fetchGridData();
    }
    setLoading(false);
  };

  const columns: ColumnsType<ProductGrigRecord> = [
    {
      title: "Actions",
      key: "actions",
      width: 150,
      render: (_, record) => (
        <Space>
          <Tooltip title="Edit Product">
            <Button
              icon={<FaEdit />}
              size="small"
              className="border border-zinc-700 bg-zinc-800 text-zinc-200 hover:bg-zinc-700 hover:text-white"
              onClick={() => handleEdit(record)}
            />
          </Tooltip>

          <CommonPopconfirm
            title="Delete Product"
            description={`Are you sure you want to delete ${record.name}?`}
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
      title: "Status",
      dataIndex: "active",
      key: "active",
      render: (active) =>
        active ? (
          <Tag color="green" className="rounded-md px-2 text-xs">
            Active
          </Tag>
        ) : (
          <Tag color="volcano" className="rounded-md px-2 text-xs">
            Inactive
          </Tag>
        ),
      width: 100,
    },
    {
      title: "Product Name",
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
      title: "Price",
      dataIndex: "price",
      key: "price",
      sorter: (a, b) => a.price - b.price,
      render: (price) => (
        <span className="text-green-400 font-semibold">
          ₹{price.toFixed(2)}
        </span>
      ),
      width: 120,
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
      sorter: (a, b) => a.category.localeCompare(b.category),
      render: (text) => (
        <span className="text-zinc-300 font-medium">{text}</span>
      ),
    },
    {
      title: "Stock",
      dataIndex: "stock",
      key: "stock",
      sorter: (a, b) => a.stock - b.stock,
      render: (stock) => (
        <span
          className={`font-medium ${
            stock > 10 ? "text-emerald-400" : "text-amber-400"
          }`}
        >
          {stock}
        </span>
      ),
      width: 100,
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

  const fetchGridData = async (isreset?: boolean) => {
    try {
      setLoading(true);
      const payload = {
        search: SearchText,
        page: page,
        pagesize: pageSize,
        categoryid: isreset ? "" : selectedCategory?.id || "",
      };
      const response: ProductGrigAPIResponse = await request({
        url: apis.ADMIN.getProduct,
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

  const fetchDropdrown = async () => {
    try {
      setLoading(true);
      const response: CommonDropdownAPIResponse = await request({
        url: apis.ADMIN.categoryDropdown,
        method: "POST",
      }).unwrap();

      if (response?.status === 401) {
        router.push("/login");
      }

      if (response?.success) {
        setdropdownData(response?.data);
      }
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message, true);
      } else {
        console.error("An unknown error occurred", error, true);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDropdrown();
  }, []);

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
                        Category
                      </label>
                      <CommonSelect
                        onChange={(e) => setselectedCategory(e)}
                        options={dropdownData}
                        value={selectedCategory}
                        placeholder="select category"
                        focusColor="blue"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-2 pt-2">
                    <CommonButton
                      themeType="dark"
                      onClick={() => {
                        setselectedCategory({});
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
      <AddProductModal
        isModalOpen={isModalOpen}
        setIsModalOpen={setisModalOpen}
        ferchGridData={fetchGridData}
        setLoading={setLoading}
        editData={editData}
        categoryDropdownData={dropdownData}
      />
    </>
  );
};

export default ProductPage;
