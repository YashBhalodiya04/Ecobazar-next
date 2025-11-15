"use client";
import CommonButton from "@/components/common/CommonButton";
import CommonInput from "@/components/common/CommonInput";
import CommonSelect from "@/components/common/CommonSelect";
import { OrderDetailData, OrderDetailItem } from "@/interfaces/OrdersInterface";
import { Modal, Image, Tag, Descriptions, Select, Input } from "antd";
import React, { useEffect, useState } from "react";
import { FaSave } from "react-icons/fa";
import { RxCross1 } from "react-icons/rx";

const orderStatusOptions = [
  { label: "Pending", value: "pending" },
  { label: "Confirmed", value: "confirmed" },
  { label: "Packed", value: "packed" },
  { label: "Shipped", value: "shipped" },
  { label: "Delivered", value: "delivered" },
  { label: "Cancelled", value: "cancelled" },
];

interface ModalProps {
  isModalopen: boolean;
  setIsModalopen: React.Dispatch<React.SetStateAction<boolean>>;
  data: OrderDetailItem | null;
  orderId: string;
  setOrderDetailData: React.Dispatch<
    React.SetStateAction<OrderDetailData | null>
  >;
}

const ViewProductDetailModal = ({
  isModalopen,
  setIsModalopen,
  data,
  orderId,
  setOrderDetailData,
}: ModalProps) => {
  const [productStatus, setProductStatus] = useState<any>({});
  const [rejectionReason, setRejectionReason] = useState(
    data?.rejectionReason || ""
  );

  useEffect(() => {
    if (isModalopen && data) {
      setProductStatus(
        orderStatusOptions?.find(
          (item) =>
            item?.value?.toLocaleLowerCase() ===
            data?.productstatus?.toLocaleLowerCase()
        )
      );
    } else {
      setProductStatus({});
      setRejectionReason("");
    }
  }, [isModalopen, data]);

  const getStatusColor = (status: string) => {
    const statusColors: Record<string, string> = {
      pending: "orange",
      confirmed: "blue",
      packed: "cyan",
      shipped: "purple",
      delivered: "green",
      cancelled: "red",
    };
    return statusColors[status] || "default";
  };

  const handleChangeStatus = () => {
    setOrderDetailData((prev) => ({
      ...prev,
      items: prev?.items?.map((item) => {
        if (item?.product == data?.product) {
          return {
            ...item,
            productstatus: productStatus?.value,
            rejectionReason: rejectionReason,
          };
        }
        return {
          ...item,
        };
      }),
    }));
    setIsModalopen(false);
  };

  if (!data) return <></>;

  const renderbutton =
    data?.productstatus !== "cancelled"
      ? [
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
            onClick={handleChangeStatus}
            icon={<FaSave />}
            children="Save Changes"
            key="save"
            className="mt-3"
          />,
        ]
      : [
          <CommonButton
            themeType="cancel"
            onClick={() => setIsModalopen(false)}
            icon={<RxCross1 />}
            children="Cancel"
            key="cancel"
            className="mt-3"
          />,
        ];

  return (
    <Modal
      title={
        <div className="flex items-center gap-3">
          <span className="text-white text-lg font-semibold">
            Product Details
          </span>
          <Tag color={getStatusColor(data.productstatus)}>
            {data.productstatus.toUpperCase()}
          </Tag>
        </div>
      }
      open={isModalopen}
      onCancel={() => setIsModalopen(false)}
      centered
      width={1000}
      className="dark-modal rounded-xl"
      footer={renderbutton}
    >
      <div className="space-y-6 py-4">
        {/* Product Image and Basic Info */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          {/* Image Section */}
          <div className="flex flex-col">
            <div className="rounded-xl">
              <Image
                src={data.mainImage}
                alt={data.productName}
                className="rounded-lg object-cover w-full"
                preview={true}
                width={300}
                fallback="/placeholder.png"
              />
            </div>
            <Descriptions
              bordered
              column={1}
              size="small"
              className="custom-descriptions"
              labelStyle={{ fontWeight: 600, width: "150px" }}
            >
              <Descriptions.Item label="Product Name" className="!text-white">
                <span className="font-semibold text-base text-white">
                  {data.productName}
                </span>
              </Descriptions.Item>
            </Descriptions>
          </div>
          <div className="">
            <Descriptions
              bordered
              column={1}
              size="small"
              className="custom-descriptions"
              labelStyle={{ fontWeight: 600, width: "150px" }}
            >
              <Descriptions.Item label="Category" className="!text-white">
                <Tag color="blue">{data.categoryName}</Tag>
              </Descriptions.Item>

              <Descriptions.Item label="Price" className="!text-white">
                <span className="text-green-600 font-bold text-lg">
                  ₹{data.price.toLocaleString()}
                </span>
              </Descriptions.Item>

              <Descriptions.Item label="Quantity" className="!text-white">
                <span className="font-semibold">{data.quantity} items</span>
              </Descriptions.Item>

              <Descriptions.Item label="Subtotal" className="!text-white">
                <span className="text-green-600 font-bold text-lg">
                  ₹{(data.price * data.quantity).toLocaleString()}
                </span>
              </Descriptions.Item>

              <Descriptions.Item
                label="Stock Available"
                className="!text-white"
              >
                <Tag
                  color={
                    data.stock > 10
                      ? "green"
                      : data.stock > 0
                      ? "orange"
                      : "red"
                  }
                >
                  {data.stock} units
                </Tag>
              </Descriptions.Item>

              <Descriptions.Item label="Current Status" className="!text-white">
                <Tag
                  color={getStatusColor(data.productstatus)}
                  className="text-sm"
                >
                  {data.productstatus.toUpperCase()}
                </Tag>
              </Descriptions.Item>
            </Descriptions>
          </div>
        </div>

        {/* Status Management Section */}
        <div className="border border-gray-200 rounded-xl p-6 text-white space-y-4">
          <h3 className="text-lg font-semibold  mb-4">Update Product Status</h3>

          {/* Status Selector */}
          <div>
            <label className="block text-sm font-medium  mb-2">
              Product Status
            </label>
            <CommonSelect
              focusColor="blue"
              options={orderStatusOptions}
              value={productStatus}
              onChange={(value) => setProductStatus(value)}
              placeholder="Select Status"
              labelKey="label"
              valueKey="value"
              disabled={
                productStatus === "delivered" || productStatus === "cancelled"
              }
            />
          </div>

          {/* Rejection Reason (only show if cancelled) */}
          {(productStatus?.value === "cancelled" || data.rejectionReason) && (
            <CommonInput
              focusColor="blue"
              id="rejectionReason"
              label="Rejection/Cancellation Reason"
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="Enter reason for cancellation..."
              rows={4}
              maxLength={500}
              istexarea={true}
            />
          )}
        </div>

        {/* Status Timeline Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-800">
            <strong>Note:</strong> Status changes will be tracked and customers
            will be notified via email about their order updates.
          </p>
        </div>
      </div>
    </Modal>
  );
};

export default ViewProductDetailModal;
