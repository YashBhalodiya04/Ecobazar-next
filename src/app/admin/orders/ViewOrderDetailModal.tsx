"use client";
import React, { useEffect, useState } from "react";
import {
  Modal,
  Table,
  Image,
  Tag,
  Space,
  Tooltip,
  TableColumnsType,
} from "antd";
import CommonButton from "@/components/common/CommonButton";
import { RxCross1 } from "react-icons/rx";
import CommonInput from "@/components/common/CommonInput";
import { Row, Col } from "antd";
import CommonSelect from "@/components/common/CommonSelect";
import { FaSave } from "react-icons/fa";
import { OrderDetailData, OrderDetailItem } from "@/interfaces/OrdersInterface";
import { useRouter } from "next/navigation";
import { useRequestMutation } from "@/redux/commonApi";
import { apis } from "@/redux/apiUrls";
import { CommonApiInterface } from "@/interfaces/commonInterace";
import { FaEye } from "react-icons/fa6";
import ViewProductDetailModal from "./ViewProductDetailModal";

interface ViewOrderDetailModalProps {
  isModalopen: boolean;
  setIsModalopen: React.Dispatch<React.SetStateAction<boolean>>;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  data: OrderDetailData | null;
  fetchGridData: () => void;
  setOrderDetailData: React.Dispatch<
    React.SetStateAction<OrderDetailData | null>
  >;
}

const orderStatusOptions = [
  { label: "Pending", value: "Pending" },
  { label: "Confirmed", value: "confirmed" },
  { label: "Packed", value: "packed" },
  { label: "Shipped", value: "shipped" },
  { label: "Delivered", value: "delivered" },
  { label: "Cancelled", value: "cancelled" },
];

const ViewOrderDetailModal = ({
  isModalopen,
  setIsModalopen,
  data,
  fetchGridData,
  setLoading,
  setOrderDetailData,
}: ViewOrderDetailModalProps) => {
  const router = useRouter();
  const [request, { isLoading }] = useRequestMutation();

  const [selectedStatus, setselectedStatus] = useState<any>({} as any);
  const [viewProductDetailModal, setViewProductDetailModal] =
    useState<boolean>(false);
  const [productDetailData, setProductDetailData] =
    useState<OrderDetailItem | null>(null);
  const [orderId, setorderId] = useState<string>("");

  useEffect(() => {
    if (isModalopen && data) {
      setselectedStatus(
        orderStatusOptions?.find(
          (item) =>
            item?.value?.toLocaleLowerCase() ===
            data?.orderStatus?.toLocaleLowerCase()
        )
      );
    } else {
      setselectedStatus({});
    }
  }, [isModalopen, data]);

  useEffect(() => {
    if (!viewProductDetailModal) {
      setorderId("");
      setProductDetailData(null);
    }
  }, [viewProductDetailModal]);

  const columns: TableColumnsType<OrderDetailItem> = [
    {
      title: "Actions",
      key: "actions",
      width: 120,
      className: "text-center",
      render: (_, record) => (
        <Space>
          <Tooltip title="View Order">
            <CommonButton
              icon={<FaEye />}
              size="small"
              onClick={() => {
                setProductDetailData(record);
                setorderId(data?._id);
                setViewProductDetailModal(true);
              }}
            />
          </Tooltip>
        </Space>
      ),
    },
    {
      title: "Product Image",
      dataIndex: "mainImage",
      key: "mainImage",
      width: 150,
      render: (img: string) => (
        <Image
          src={img}
          width={80}
          height={60}
          style={{ borderRadius: 8 }}
          preview={true}
        />
      ),
    },
    {
      title: "Product Name",
      dataIndex: "productName",
      key: "productName",
    },
    {
      title: "Category",
      dataIndex: "categoryName",
      key: "categoryName",
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      render: (price: number) => `₹${price.toFixed(2)}`,
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      key: "quantity",
    },
    {
      title: "Stock",
      dataIndex: "stock",
      key: "stock",
    },
  ];

  const handleChangeStatus = async () => {
    try {
      const payload = {
        orderid: data?._id,
        status: selectedStatus?.value,
      };
      const response: CommonApiInterface = await request({
        url: apis.ADMIN.changeOrderStatus,
        method: "POST",
        body: payload,
      }).unwrap();
      if (response?.success) {
        await fetchGridData();
        setIsModalopen(false);
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

  return (
    <>
      <Modal
        title={
          <span className="text-white text-lg font-semibold">
            Order Details - {data?._id}
          </span>
        }
        open={isModalopen}
        onCancel={() => setIsModalopen(false)}
        centered
        width={1200}
        className="dark-modal rounded-xl"
        footer={[
          <CommonButton
            themeType="cancel"
            onClick={() => setIsModalopen(false)}
            icon={<RxCross1 />}
            children="Cancel"
            key="cancel"
            className="mt-3"
          />,
          <CommonButton
            themeType="dark"
            onClick={() => handleChangeStatus()}
            icon={<FaSave />}
            children="Save"
            key="save"
            className="mt-3"
          />,
        ]}
      >
        {/* USER DETAILS */}
        <Row gutter={[16, 16]} className="mb-4">
          <Col span={12}>
            <CommonInput
              id="customerName"
              label="Customer Name"
              value={data?.username}
              readOnly
              focusColor="blue"
              disabled
            />
          </Col>

          <Col span={12}>
            <div>
              <label className="block font-medium mb-2 text-gray-300">
                Order Status <span className="text-red-400">*</span>
              </label>
              <CommonSelect
                options={orderStatusOptions}
                onChange={(e) => setselectedStatus(e)}
                value={selectedStatus}
                placeholder="Select Status"
                labelKey="label"
                valueKey="value"
                disabled={
                  data?.orderStatus === "delivered" ||
                  data?.orderStatus === "cancelled"
                }
              />
            </div>
          </Col>

          <Col span={12}>
            <CommonInput
              id="paymentMethod"
              label="Payment Method"
              value={data?.paymentInfo?.method}
              readOnly
              focusColor="blue"
              disabled
            />
          </Col>

          <Col span={12}>
            <CommonInput
              id="paymentStatus"
              label="Payment Status"
              value={data?.paymentInfo?.status}
              readOnly
              focusColor="blue"
              disabled
            />
          </Col>
        </Row>
        {/* SHIPPING ADDRESS */}
        <Row gutter={[16, 16]} className="mb-4">
          <Col span={12}>
            <CommonInput
              id="fullName"
              label="Full Name"
              value={data?.shippingAddress?.fullName}
              readOnly
              focusColor="blue"
              disabled
            />
          </Col>

          <Col span={12}>
            <CommonInput
              id="phone"
              label="Phone"
              value={data?.shippingAddress?.phone}
              readOnly
              focusColor="blue"
              disabled
            />
          </Col>

          <Col span={24}>
            <CommonInput
              id="address"
              label="Address"
              value={data?.shippingAddress?.addressLine1}
              readOnly
              istexarea={true}
              focusColor="blue"
              disabled
            />
          </Col>

          <Col span={12}>
            <CommonInput
              id="city"
              label="City"
              value={data?.shippingAddress?.city}
              readOnly
              focusColor="blue"
              disabled
            />
          </Col>

          <Col span={12}>
            <CommonInput
              id="state"
              label="State"
              value={data?.shippingAddress?.state}
              readOnly
              focusColor="blue"
              disabled
            />
          </Col>

          <Col span={12}>
            <CommonInput
              id="postalCode"
              label="Postal Code"
              value={data?.shippingAddress?.postalCode}
              readOnly
              focusColor="blue"
              disabled
            />
          </Col>

          <Col span={12}>
            <CommonInput
              id="country"
              label="Country"
              value={data?.shippingAddress?.country}
              readOnly
              focusColor="blue"
              disabled
            />
          </Col>
        </Row>

        {/* ORDER ITEMS */}
        <Table
          title={() => (
            <span className="text-white text-base font-medium">
              Ordered Items
            </span>
          )}
          className="ant-table-h-orderModal"
          dataSource={data?.items || []}
          columns={columns}
          rowKey={"product"}
          pagination={false}
        />
      </Modal>
      <ViewProductDetailModal
        data={productDetailData}
        isModalopen={viewProductDetailModal}
        setIsModalopen={setViewProductDetailModal}
        orderId={orderId}
        setOrderDetailData={setOrderDetailData}
      />
    </>
  );
};

export default ViewOrderDetailModal;
