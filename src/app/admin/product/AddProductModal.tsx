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
import CommonDatePicker from "@/components/common/CommonDatePicker";
import dayjs from "dayjs";

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

  const [isOfferEnabled, setIsOfferEnabled] = useState<boolean>(false);

  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [previewOpen, setPreviewOpen] = useState<boolean>(false);
  const [previewImage, setPreviewImage] = useState<string>("");

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    watch,
    control,
    getValues,
    formState: { errors },
  } = useForm<ProductCreateInput>({
    resolver: zodResolver(ProductCreateSchema),
    defaultValues: {
      name: "",
      description: "",
      price: "",
      stock: "",
      active: true,
      hasOffer: false,
      offer: {
        title: "",
        discountPercent: "",
        validUntil: "",
        description: "",
      },
    },
  });

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
      const offerData = {
        title: editData?.offer?.title || "",
        discountPercent: String(editData?.offer?.discountPercent) || "",
        validUntil: editData?.offer?.validUntil || "",
        description: editData?.offer?.description || "",
      };
      setIsOfferEnabled(!!editData?.offer?.title);
      setValue("offer", offerData);
      setValue("hasOffer", !!editData?.offer?.title);
      if (editData?.images) {
        const images: UploadFile[] = editData.images.map((image) => ({
          uid: image.id,
          name: "existing_image.png",
          status: "done" as UploadFile["status"], // <-- assert the correct type
          url: image.url,
        }));
        setFileList(images);
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
    if (newFileList.length > 5) {
      Toast.error("You can upload a maximum of 5 images.");
      return;
    }

    const validatedFiles: typeof newFileList = [];

    for (const file of newFileList) {
      // Keep existing files from DB
      if (!file.originFileObj) {
        validatedFiles.push(file);
        continue;
      }

      // Validate new files
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
    if (fileList?.length === 0) {
      Toast.error("Please upload an image");
      return;
    }

    if (!selectedCategory?.id) {
      Toast.error("Please select a category");
      return;
    }

    const imageData = fileList?.map((item) => {
      return {
        id: item?.name === "existing_image.png" ? "" : item?.uid,
        url: item?.url || "",
      };
    });
    const offerData = isOfferEnabled
      ? {
          title: data.offer?.title || "",
          discountPercent: Number(data.offer?.discountPercent) || 0,
          validUntil: data.offer?.validUntil || "",
          description: data.offer?.description || "",
        }
      : undefined;

    const payload = {
      name: data?.name,
      description: data?.description,
      price: Number(data?.price),
      categoryid: selectedCategory?.id || "",
      stock: Number(data?.stock),
      productid: editData?.id,
      active: data?.active,
      images: imageData,
      offer: offerData,
    };
    const formdata = new FormData();
    formdata.append("data", JSON.stringify(payload));
    if (fileList?.length > 0) {
      fileList.forEach((file) => {
        if (file.originFileObj) {
          formdata.append("files", file.originFileObj);
        }
      });
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
      if (response?.statuscode === 401) {
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
      width={900}
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
        <div className="grid grid-cols-2 md:grid-cols-2 gap-4">
          <CommonInput
            id="name"
            label="Product Name"
            type="text"
            placeholder="Enter product name"
            {...register("name")}
            errorMessage={errors.name?.message}
            focusColor="blue"
            required
          />

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

          <div>
            <label className="block font-medium mb-2 text-gray-300">
              Category <span className="text-red-400">*</span>
            </label>
            <CommonSelect
              options={categoryDropdownData}
              onChange={(e) => setselectedCategory(e)}
              value={selectedCategory}
              placeholder="Select category"
            />
          </div>
        </div>
        <CommonInput
          id="description"
          label="Description"
          type="text"
          placeholder="Enter product description"
          {...register("description")}
          errorMessage={errors.description?.message}
          required
          focusColor="blue"
        />

        {/* === Image Upload === */}
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

        {/* === Offer Section === */}
        <div className="flex items-center justify-between pt-4">
          <label className="font-medium text-gray-300">Offer</label>
          <Switch
            checked={isOfferEnabled}
            onChange={(checked) => setIsOfferEnabled(checked)}
            className="bg-gray-600"
          />
        </div>

        {isOfferEnabled && (
          <div className="grid grid-cols-2 md:grid-cols-2 gap-4 mt-3 ">
            <CommonInput
              id="offerTitle"
              label="Offer Title"
              type="text"
              placeholder="Enter offer title"
              {...register("offer.title")}
              errorMessage={errors.offer?.title?.message}
              focusColor="blue"
              required
            />
            <CommonInput
              id="discountPercent"
              label="Discount (%)"
              type="number"
              placeholder="Enter discount percentage"
              {...register("offer.discountPercent")}
              errorMessage={errors.offer?.discountPercent?.message}
              focusColor="blue"
              required
            />
            <CommonDatePicker
              id="validUntil"
              label="Valid Until"
              control={control}
              name="offer.validUntil"
              errorMessage={errors.offer?.validUntil?.message}
              focusColor="blue"
              minDate={
                getValues("offer.validUntil")
                  ? dayjs(getValues("offer.validUntil"))
                  : dayjs()
              }
              placeholder="Select to date"
              format={{
                format: "DD-MM-YYYY",
                type: "mask",
              }}
            />
            <CommonInput
              id="offerDescription"
              label="Offer Description"
              type="text"
              placeholder="Enter offer description"
              {...register("offer.description")}
              errorMessage={errors.offer?.description?.message}
              focusColor="blue"
            />
          </div>
        )}

        {/* === Active Switch === */}
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
