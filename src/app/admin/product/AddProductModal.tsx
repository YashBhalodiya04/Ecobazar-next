"use client";
import CommonInput from "@/components/common/CommonInput";
import CommonSelect from "@/components/common/CommonSelect";
import { Toast } from "@/components/common/toastUtils";
import { isRestrictedFile } from "@/helper/CommonUtils";
import {
  CommonApiInterface,
  CommonDropdownOptions,
} from "@/interfaces/commonInterace";
import { ProductGrigRecord } from "@/interfaces/ProductInterface";
import { useRequestMutation } from "@/redux/commonApi";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Button,
  Image,
  Modal,
  Switch,
  Upload,
  UploadFile,
  UploadProps,
} from "antd";
import { useRouter } from "next/navigation";
import React, { SetStateAction, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { UploadOutlined } from "@ant-design/icons";
import { ProductCreateInput, ProductCreateSchema } from "@/schemas/authSchemas";
import { apis } from "@/redux/apiUrls";
import CommonButton from "@/components/common/CommonButton";
import { RxCross1 } from "react-icons/rx";
import { FaSave } from "react-icons/fa";

interface ModalProps {
  isModalOpen: boolean;
  setIsModalOpen: React.Dispatch<SetStateAction<boolean>>;
  ferchGridData: () => void;
  setLoading: React.Dispatch<SetStateAction<boolean>>;
  editData: ProductGrigRecord | null;
  categoryDropdownData: CommonDropdownOptions[];
}

const AddProductModal: React.FC<ModalProps> = ({
  isModalOpen,
  setIsModalOpen,
  ferchGridData,
  setLoading,
  editData,
  categoryDropdownData,
}) => {
  const router = useRouter();
  const [request, { isLoading }] = useRequestMutation();

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { errors },
  } = useForm<ProductCreateInput>({
    resolver: zodResolver(ProductCreateSchema),
    defaultValues: {
      name: "",
      description: "",
      price: "",
      stock: "",
      active: true,
    },
  });

  // Upload state
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [previewOpen, setPreviewOpen] = useState<boolean>(false);
  const [previewImage, setPreviewImage] = useState<string>("");

  const [selectedCategory, setselectedCategory] =
    useState<CommonDropdownOptions>();

  useEffect(() => {
    if (editData && isModalOpen) {
      setValue("name", editData.name);
      setValue("description", editData.description);
      setValue("active", editData.active);
      setValue("price", String(editData.price));
      setValue("stock", String(editData.stock));
      setselectedCategory(
        categoryDropdownData?.find((item) => item?.id == editData?.categoryid)
      );

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

  const handlePreview = (file: any) => {
    setPreviewImage(file.url || file.thumbUrl);
    setPreviewOpen(true);
  };

  const handleChange: UploadProps["onChange"] = async ({
    fileList: newFileList,
  }) => {
    // Limit to max 5 files
    if (newFileList.length > 5) {
      Toast.error("You can upload a maximum of 5 images.");
      return;
    }

    // Validate each new file
    const validatedFiles: typeof newFileList = [];
    for (const file of newFileList) {
      if (!file.originFileObj) continue;

      const isRestrict = isRestrictedFile(file.originFileObj.name);
      if (isRestrict?.valid) {
        Toast.error(`${isRestrict?.message}`);
        continue;
      }

      const fileType = file.originFileObj.type;
      const allowedTypes = ["image/jpeg", "image/png"];
      if (!allowedTypes.includes(fileType)) {
        Toast.error("Invalid file type. Please upload a JPEG or PNG file.");
        continue;
      }

      if (file.originFileObj.size > 5 * 1024 * 1024) {
        Toast.error("File size exceeds the maximum limit of 5 MB");
        continue;
      }

      validatedFiles.push(file);
    }

    setFileList(validatedFiles);
  };

  const handleRemove = (file: any) => {
    // Remove the selected file from the fileList
    const newList = fileList.filter((f) => f.uid !== file.uid);
    setFileList(newList);

    // Reset preview if removed file was being previewed
    if (previewImage === file.url || previewImage === file.thumbUrl) {
      setPreviewImage("");
      setPreviewOpen(false);
    }

    return true; // allow removal
  };

  const handleOk = handleSubmit(async (data) => {
    if (!data?.imagepath && fileList?.length === 0) {
      Toast.error("Please upload an image");
      return;
    }

    const payload = {
      name: data?.name,
      description: data?.description,
      price: Number(data?.price),
      categoryid: selectedCategory?.id || "",
      stock: Number(data?.stock),
      productid: editData?.id,
      active: data?.active,
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
        url: apis.ADMIN.saveProduct,
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

  return (
    <Modal
      title={
        <span className="text-white text-lg font-semibold">
          {editData ? "Edit" : "Add"} Product
        </span>
      }
      open={isModalOpen}
      onCancel={() => {
        setFileList([]);
        setIsModalOpen(false);
      }}
      footer={[
        <CommonButton
          themeType="cancel"
          onClick={() => {
            reset();
            setFileList([]);
            setPreviewImage("");
            setPreviewOpen(false);
            setselectedCategory({});
            setIsModalOpen(false);
          }}
          icon={<RxCross1 />}
          children="Cancel"
          key="cancel"
          className="mt-3"
        />,
        <CommonButton
          themeType="dark"
          form="addProductForm"
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
        id="addProductForm"
        className="space-y-4 text-gray-200"
        onSubmit={handleOk}
      >
        {/* Name */}
        <CommonInput
          id="name"
          label="Name"
          type="text"
          placeholder="Enter product name"
          {...register("name")}
          errorMessage={errors.name?.message}
          focusColor="blue"
          required
        />

        {/* Description */}
        <CommonInput
          id="description"
          label="Description"
          type="text"
          placeholder="Enter description"
          {...register("description")}
          errorMessage={errors.description?.message}
          focusColor="blue"
          required
        />

        {/* Price */}
        <CommonInput
          id="price"
          label="Price"
          type="text"
          placeholder="Enter price"
          {...register("price")}
          errorMessage={errors.price?.message}
          focusColor="blue"
          required
        />

        {/* Stock */}
        <CommonInput
          id="stock"
          label="Stock"
          type="text"
          placeholder="Enter stock quantity"
          {...register("stock")}
          errorMessage={errors.stock?.message}
          focusColor="blue"
          required
        />

        {/* Category Dropdown */}
        <div>
          <label className="block font-medium mb-1 text-gray-300">
            Category <span className="text-red-400">*</span>
          </label>
          <CommonSelect
            options={categoryDropdownData}
            onChange={(e) => setselectedCategory(e)}
            value={selectedCategory}
            placeholder="Select category"
            focusColor="blue"
          />
        </div>

        {/* Image Upload */}
        <div>
          <label className="block font-medium mb-1 text-gray-300">
            Images <span className="text-red-400">*</span>
          </label>
          <Upload
            listType="picture-card"
            fileList={fileList}
            onPreview={handlePreview}
            onRemove={handleRemove}
            onChange={handleChange}
            accept="image/jpeg, image/png"
            maxCount={5}
          >
            {fileList.length >= 5 ? null : (
              <div className="text-white">
                <UploadOutlined />
                <div style={{ marginTop: 8 }}>Upload</div>
              </div>
            )}
          </Upload>
          {errors.imagepath && (
            <p className="text-red-400 text-sm mt-1">
              {errors.imagepath.message}
            </p>
          )}

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
  );
};

export default AddProductModal;
