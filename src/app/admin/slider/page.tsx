"use client";

import React, { useEffect, useState } from "react";
import { Table, Button, Image, Space, Tag, Tooltip } from "antd";
import type { ColumnsType } from "antd/es/table";
import { FaEdit, FaTrashAlt, FaPlus } from "react-icons/fa";
import CommonInput from "@/components/common/CommonInput";
import { useRequestMutation } from "@/redux/commonApi";
import { useRouter } from "next/navigation";
import CommonLoader from "@/components/common/CommonLoader";
import CommonButton from "@/components/common/CommonButton";
import CommonPopconfirm from "@/components/common/CommonPopconfirm";
import { apis } from "@/redux/apiUrls";
import { CommonApiInterface } from "@/interfaces/commonInterace";
import {
  MainSliderGrigAPIResponse,
  MainSliderGrigRecord,
} from "@/interfaces/MainSliderInterface";
import AddSlidersModal from "./AddSlidersModal";
import dayjs from "dayjs";

const SliderPage: React.FC = () => {
  const router = useRouter();
  const [request] = useRequestMutation();

  const [loading, setLoading] = useState<boolean>(false);
  const [timeoutId, setTimeoutId] = useState<any>();
  const [sortedInfo, setSortedInfo] = useState<any>({});
  const [pageSize, setPageSize] = useState<number>(20);
  const [page, setPage] = useState<number>(1);
  const [totalData, setTotalData] = useState<number>(0);
  const [totalFiltered, setTotalFiltered] = useState<number>(0);
  const [sliderList, setSliderList] = useState<MainSliderGrigRecord[]>([]);
  const [searchText, setSearchText] = useState<string>("");

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editData, setEditData] = useState<MainSliderGrigRecord | null>(null);

  // Reset edit data when modal closes
  useEffect(() => {
    if (!isModalOpen) {
      setEditData(null);
    }
  }, [isModalOpen]);

  const handleChange = (pagination: any, _: any, sorter: any) => {
    setSortedInfo(sorter);
    setPageSize(pagination.pageSize);
    setPage(pagination.current);
  };

  const fetchGridData = async () => {
    try {
      setLoading(true);
      const payload = {
        search: searchText,
        page: page,
        pagesize: pageSize,
      };
      const response: MainSliderGrigAPIResponse = await request({
        url: apis.ADMIN.getSlider,
        method: "POST",
        body: payload,
      }).unwrap();
      if (response?.statuscode === 401) {
        router.push("/login");
      }
      if (response?.success) {
        setSliderList(response?.data?.data || []);
        setTotalData(Number(response?.data?.recordsTotal) || 0);
        setTotalFiltered(Number(response?.data?.recordsFiltered) || 0);
      } else {
        setSliderList([]);
        setTotalData(0);
        setTotalFiltered(0);
      }
    } catch (error) {
      console.error("Error fetching sliders:", error);
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
  }, [searchText, pageSize, sortedInfo]);

  const handleDelete = async (record: MainSliderGrigRecord) => {
    setLoading(true);
    const response: CommonApiInterface = await request({
      url: apis.ADMIN.deleteSlider,
      method: "POST",
      body: { id: record?.sliderid },
    }).unwrap();
    if (response?.statuscode === 401) {
      router.push("/login");
    }
    if (response?.success) {
      await fetchGridData();
    }
    setLoading(false);
  };

  const handleEdit = (record: MainSliderGrigRecord) => {
    setEditData(record);
    setIsModalOpen(true);
  };

  const columns: ColumnsType<MainSliderGrigRecord> = [
    {
      title: "Actions",
      key: "actions",
      width: 150,
      render: (_, record) => (
        <Space>
          <Tooltip title="Edit Slider">
            <Button
              icon={<FaEdit />}
              size="small"
              onClick={() => handleEdit(record)}
              className="border border-zinc-700 bg-zinc-800 text-zinc-200 hover:bg-zinc-700 hover:text-white"
            />
          </Tooltip>

          <CommonPopconfirm
            title="Delete Slider"
            description={`Are you sure you want to delete ${record.title}?`}
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
      title: "Active",
      dataIndex: "active",
      key: "active",
      width: 120,
      render: (active: boolean) =>
        active ? (
          <Tag color="green">Active</Tag>
        ) : (
          <Tag color="red">Inactive</Tag>
        ),
    },
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      sorter: (a, b) => a.title.localeCompare(b.title),
      render: (text) => (
        <span className="text-zinc-100 font-medium">{text}</span>
      ),
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      render: (text) => (
        <span className="text-zinc-400 text-sm max-w-xs line-clamp-2">
          {text}
        </span>
      ),
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
    {
      title: "From Date",
      dataIndex: "fromDate",
      key: "fromDate",
      render: (text) => (
        <span className="text-zinc-400 text-sm">
          {text ? dayjs(text).format("DD-MM-YYYY") : "-"}
        </span>
      ),
    },
    {
      title: "To Date",
      dataIndex: "toDate",
      key: "toDate",
      render: (text) => (
        <span className="text-zinc-400 text-sm">
          {text ? dayjs(text).format("DD-MM-YYYY") : "-"}
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
              placeholder="Search Slider..."
              value={searchText}
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
          dataSource={sliderList}
          onChange={handleChange}
          rowKey="sliderid"
          className="custom-ant-table-new"
          pagination={{
            position: ["bottomRight"],
            pageSize: pageSize,
            showSizeChanger: true,
            responsive: true,
            total: totalFiltered,
            showTotal: (total, range) => (
              <span className="pagination-text">
                Showing {range[0]} to {range[1]} of {totalFiltered} entries
                {totalFiltered !== totalData && (
                  <> (filtered from {totalData} total entries)</>
                )}
              </span>
            ),
            pageSizeOptions: ["10", "20", "50", "100"],
            current: page,
          }}
          scroll={{ x: "max-content" }}
        />
      </div>

      <AddSlidersModal
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        ferchGridData={fetchGridData}
        setLoading={setLoading}
        editData={editData}
      />
    </>
  );
};

export default SliderPage;
