import {
  MainSliderGrigRecord,
  MainSliderPayload,
} from "@/interfaces/MainSliderInterface";
import { useRequestMutation } from "@/redux/commonApi";
import { mainSliderSchema } from "@/schemas/authSchemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import React, { SetStateAction, useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  Modal,
  Upload,
  Button,
  Switch,
  Image,
  UploadProps,
  UploadFile,
  DatePicker,
} from "antd";
import CommonButton from "@/components/common/CommonButton";
import { RxCross1 } from "react-icons/rx";
import { FaSave } from "react-icons/fa";
import { Toast } from "@/components/common/toastUtils";
import CommonInput from "@/components/common/CommonInput";
import { isRestrictedFile } from "@/helper/CommonUtils";
import { UploadOutlined } from "@ant-design/icons";
import dayjs, { Dayjs } from "dayjs";
import CommonDatePicker from "@/components/common/CommonDatePicker";
import { CommonApiInterface } from "@/interfaces/commonInterace";
import { apis } from "@/redux/apiUrls";

interface ModalProps {
  isModalOpen: boolean;
  setIsModalOpen: React.Dispatch<SetStateAction<boolean>>;
  ferchGridData: () => void;
  setLoading: React.Dispatch<SetStateAction<boolean>>;
  editData: MainSliderGrigRecord | null;
}

const AddSlidersModal: React.FC<ModalProps> = ({
  isModalOpen,
  setIsModalOpen,
  ferchGridData,
  setLoading,
  editData,
}) => {
  const router = useRouter();
  const datepisckerref = useRef<any>(null);
  const [request] = useRequestMutation();
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    control,
    getValues,
    formState: { errors },
  } = useForm<MainSliderPayload>({
    resolver: zodResolver(mainSliderSchema),
    defaultValues: {
      title: "",
      description: "",
      imagepath: "",
      active: true,
      fromdate: dayjs().toISOString(), // today
      todate: dayjs().add(10, "day").toISOString(), // 10 days later
    },
  });
  useEffect(() => {
    if (editData && isModalOpen) {
      setValue("title", editData?.title);
      setValue("description", editData.description);
      setValue("active", editData.active);
      setValue("imagepath", editData.image);
      setValue("fromdate", editData.fromDate);
      setValue("todate", editData.toDate);

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

  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [previewOpen, setPreviewOpen] = useState<boolean>(false);
  const [previewImage, setPreviewImage] = useState<string>("");

  const handlePreview = (file: any) => {
    setPreviewImage(file.url || file.thumbUrl);
    setPreviewOpen(true);
  };

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

  const handleOk = handleSubmit(async (data) => {
    if (!data?.imagepath && fileList?.length === 0) {
      Toast.error("Please upload an image");
      return;
    }

    const payload = {
      title: data?.title,
      description: data.description,
      imagepath: data.imagepath,
      sliderid: editData?.sliderid || "",
      active: data.active,
      fromdate: data.fromdate,
      todate: data.todate,
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
        url: apis.ADMIN.createSlider,
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
          {editData ? "Edit" : "Add"} Slider
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
          form="addsliderForm"
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
        id="addsliderForm"
        className="space-y-4 text-gray-200"
        onSubmit={handleOk}
        ref={datepisckerref}
      >
        <CommonInput
          id="title"
          label="Title"
          type="text"
          placeholder="Enter slider title"
          {...register("title")}
          errorMessage={errors.title?.message}
          focusColor="blue"
        />
        <CommonInput
          id="description"
          label="Description"
          type="text"
          placeholder="Enter description"
          {...register("description")}
          errorMessage={errors.description?.message}
          focusColor="blue"
        />
        <CommonDatePicker
          id="fromdate"
          label="From Date"
          control={control}
          name="fromdate"
          errorMessage={errors.fromdate?.message}
          focusColor="blue"
          placeholder="Select from date"
          minDate={dayjs()}
          format={{
            format: "DD-MM-YYYY",
            type: "mask",
          }}
        />
        <CommonDatePicker
          id="todate"
          label="To Date"
          control={control}
          name="todate"
          errorMessage={errors.todate?.message}
          focusColor="blue"
          minDate={
            getValues("fromdate") ? dayjs(getValues("fromdate")) : dayjs()
          }
          placeholder="Select to date"
          format={{
            format: "DD-MM-YYYY",
            type: "mask",
          }}
        />
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
  );
};

export default AddSlidersModal;
