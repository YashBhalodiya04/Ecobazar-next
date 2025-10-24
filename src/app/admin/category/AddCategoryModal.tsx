"use client";
import React, { SetStateAction, useEffect, useState } from "react";
import {
  Modal,
  Upload,
  Button,
  Switch,
  Image,
  UploadProps,
  UploadFile,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import CommonInput from "@/components/common/CommonInput"; // adjust import path
import { isRestrictedFile } from "@/helper/CommonUtils";
import { Toast } from "@/components/common/toastUtils";
import { useRouter } from "next/navigation";
import { useRequestMutation } from "@/redux/commonApi";
import { CommonApiInterface } from "@/interfaces/commonInterace";
import { apis } from "@/redux/apiUrls";
import { CategoryGrigRecord } from "@/interfaces/CategoryInterface";
import { CategoryFormData, categorySchema } from "@/schemas/authSchemas";
import CommonButton from "@/components/common/CommonButton";
import { RxCross1 } from "react-icons/rx";
import { FaSave } from "react-icons/fa";

interface ModalProps {
  isModalOpen: boolean;
  setIsModalOpen: React.Dispatch<SetStateAction<boolean>>;
  ferchGridData: () => void;
  setLoading: React.Dispatch<SetStateAction<boolean>>;
  editData: CategoryGrigRecord | null;
}

const AddCategoryModal: React.FC<ModalProps> = ({
  isModalOpen,
  setIsModalOpen,
  ferchGridData,
  setLoading,
  editData,
}) => {
  const router = useRouter();
  const [request, { isLoading }] = useRequestMutation();
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: "",
      description: "",
      active: true,
      imagepath: "",
    },
  });

  useEffect(() => {
    if (editData && isModalOpen) {
      setValue("name", editData.name);
      setValue("description", editData.description);
      setValue("active", editData.active);
      setValue("imagepath", editData.image);

      if (editData.image) {
        setFileList([
          {
            uid: "-1",
            name: "existing_image.png",
            status: "done",
            url: editData.image, // this should be a full URL
          },
        ]);
        setPreviewImage(editData.image);
      }
    }
  }, [editData, isModalOpen]);

  // Upload state
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");

  const handlePreview = (file: any) => {
    setPreviewImage(file.url || file.thumbUrl);
    setPreviewOpen(true);
  };

  const handleOk = handleSubmit(async (data) => {
    if (!data?.imagepath && fileList?.length === 0) {
      Toast.error("Please upload an image");
      return;
    }

    const payload = {
      name: data.name,
      description: data.description,
      imagepath: data.imagepath,
      categoryid: editData?.categoryid || "",
      active: data.active,
    };
    const formdata = new FormData();
    formdata.append("data", JSON.stringify(payload));
    if (fileList?.length > 0 && fileList[0].originFileObj) {
      formdata.append("files", fileList[0].originFileObj);
    } else {
      formdata.append("files", "");
    }

    try {
      setLoading(true);
      const response: CommonApiInterface = await request({
        url: apis.ADMIN.createCategory,
        method: "POST",
        body: formdata,
      }).unwrap();
      if (response?.status === 401) {
        router.push("/login");
      }
      if (response?.success) {
        reset();
        setFileList([]);
        setPreviewImage("");
        setPreviewOpen(false);
        await ferchGridData();
        setIsModalOpen(false);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  });

  const handleChange: UploadProps["onChange"] = async ({
    fileList: newFileList,
  }) => {
    if (newFileList.length > 0 && newFileList[0].originFileObj) {
      const lastFile = newFileList[newFileList.length - 1]; // Get the last file object
      if (lastFile.originFileObj) {
        const isRestrict = isRestrictedFile(lastFile.originFileObj?.name);
        if (isRestrict?.valid == true) {
          Toast.error(`${isRestrict?.message}`);
          return;
        }

        // Validate file size (limit: 1 MB = 1024 * 1024 bytes)
        const fileType = lastFile.originFileObj.type;
        const allowedTypes = ["image/jpeg", "image/png"];

        // Validate file type
        if (!allowedTypes.includes(fileType)) {
          Toast.error("Invalid file type. Please upload a JPEG or PNG file.");
          return;
        }

        // Validate file size (limit: 1 MB = 1024 * 1024 bytes)
        if (lastFile.originFileObj.size > 5 * 1024 * 1024) {
          Toast.error("File size exceeds the maximum limit of 5 MB");
          return;
        }
        setFileList([lastFile]);
      }
    }
  };

  const handleRemove = (file: any) => {
    setFileList([]);
    setValue("imagepath", "");
    setPreviewImage("");
    setPreviewOpen(false);
  };

  return (
    <>
      <Modal
        title={
          <span className="text-white text-lg font-semibold">
            {editData ? "Edit" : "Add"} Category
          </span>
        }
        open={isModalOpen}
        onCancel={() => {
          reset();
          setFileList([]);
          setIsModalOpen(false);
        }}
        footer={[
          <CommonButton
            themeType="cancel"
            onClick={() => {
              reset();
              setFileList([]);
              setIsModalOpen(false);
            }}
            icon={<RxCross1 />}
            children="Cancel"
            key="cancel"
            className="mt-3"
          />,
          <CommonButton
            themeType="dark"
            form="addCategoryForm"
            htmlType="submit"
            icon={<FaSave />}
            key="save"
            onClick={handleOk}
            children={editData ? "Update" : "Add"}
          />,
        ]}
        centered
        className="dark-modal rounded-xl"
      >
        <form
          id="addCategoryForm"
          className="space-y-4 text-gray-200"
          onSubmit={handleOk}
        >
          {/* Name */}
          <CommonInput
            id="name"
            label="Name"
            type="text"
            placeholder="Enter category name"
            {...register("name")}
            errorMessage={errors.name?.message}
          />

          {/* Description */}
          <CommonInput
            id="description"
            label="Description"
            type="text"
            placeholder="Enter description"
            {...register("description")}
            errorMessage={errors.description?.message}
          />

          {/* Image Upload */}
          <div>
            <label className="block font-medium mb-1 text-gray-300">
              Image <span className="text-red-400">*</span>
            </label>
            <Upload
              listType="picture-card"
              fileList={fileList}
              onPreview={handlePreview}
              onRemove={handleRemove}
              onChange={handleChange}
              accept="image/jpeg, image/png"
              maxCount={1}
            >
              {fileList.length >= 1 ? null : (
                <div className="text-white">
                  <UploadOutlined />
                  <div style={{ marginTop: 8 }}>Upload</div>
                </div>
              )}
            </Upload>
            {previewImage && (
              <Image
                wrapperStyle={{ display: "none" }}
                preview={{
                  visible: previewOpen,
                  onVisibleChange: (visible) => setPreviewOpen(visible),
                  afterOpenChange: (visible) => !visible && setPreviewImage(""),
                }}
                src={previewImage}
              />
            )}
          </div>

          {/* Active Switch */}
          <div className="flex items-center justify-between pt-2">
            <label className="font-medium text-gray-300">Active</label>
            <Switch
              defaultChecked={true}
              onChange={(checked) => setValue("active", checked)}
              className="bg-gray-600"
            />
          </div>
        </form>
      </Modal>
    </>
  );
};

export default AddCategoryModal;
