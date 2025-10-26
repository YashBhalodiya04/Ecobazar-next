'use client'
import CommonButton from "@/components/common/CommonButton";
import { ProductGrigRecord } from "@/interfaces/ProductInterface";
import { Modal, Image } from "antd";
import React, { SetStateAction } from "react";
import { RxCross1 } from "react-icons/rx";

interface ModalProps {
  isModalOpen: boolean;
  setIsModalOpen: React.Dispatch<SetStateAction<boolean>>;
  editData: ProductGrigRecord | null;
}

const ViewUploadFileModal = ({
  isModalOpen,
  setIsModalOpen,
  editData,
}: ModalProps) => {
  const images = editData?.images ?? [];

  return (
    <Modal
      title={
        <span className="text-white text-lg font-semibold">
          View Uploaded Images
        </span>
      }
      width={900}
      open={isModalOpen}
      onCancel={() => setIsModalOpen(false)}
      footer={[
        <CommonButton
          themeType="cancel"
          onClick={() => setIsModalOpen(false)}
          icon={<RxCross1 />}
          key="cancel"
          children="Close"
          className="mt-3"
        />,
      ]}
      centered
      className="dark-modal rounded-xl"
    >
      {images.length > 0 ? (
        <div className="grid grid-cols-4 gap-4">
          <Image.PreviewGroup>
            {images.map((img, index) => (
              <div
                key={index}
                className="bg-gray-800 py-5 rounded-lg flex justify-center items-center"
              >
                <Image
                  src={img.url}
                  alt={`Product Image ${index + 1}`}
                  className="rounded-lg"
                  height={150}
                  width={150}
                  style={{
                    objectFit: "cover",
                    borderRadius: "8px",
                  }}
                />
              </div>
            ))}
          </Image.PreviewGroup>
        </div>
      ) : (
        <p className="text-gray-400 text-center py-6">
          No images available for this product.
        </p>
      )}
    </Modal>
  );
};

export default ViewUploadFileModal;
