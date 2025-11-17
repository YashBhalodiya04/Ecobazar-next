"use client";

import CommonButton from "@/components/common/CommonButton";
import CommonInput from "@/components/common/CommonInput";
import { CommonApiInterface } from "@/interfaces/commonInterace";
import {
  CommonMasterGridRecord,
  CommonMasterPayload,
} from "@/interfaces/CommonMasterInterface";
import { apis } from "@/redux/apiUrls";
import { useRequestMutation } from "@/redux/commonApi";
import { CommonMasterSchema, FormType } from "@/schemas/authSchemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { Modal } from "antd";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { FaSave } from "react-icons/fa";
import { FaMinus, FaPlus } from "react-icons/fa6";
import { RxCross1 } from "react-icons/rx";

interface Modalprops {
  isModalopen: boolean;
  setIsModalopen: React.Dispatch<React.SetStateAction<boolean>>;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  fetchgridData: () => void;
  editData: CommonMasterGridRecord | null;
}

const AddCommonMasterModal = ({
  isModalopen,
  setIsModalopen,
  setLoading,
  fetchgridData,
  editData,
}: Modalprops) => {
  const router = useRouter();
  const [request, { isLoading }] = useRequestMutation();
  const {
    control,
    handleSubmit,
    register,
    setValue,
    formState: { errors },
    reset,
  } = useForm<FormType>({
    resolver: zodResolver(CommonMasterSchema),
    defaultValues: {
      mastername: "",
      remarks: "",
      subdata: [{ keyid: "", keyvalue: "" }],
    },
  });

  useEffect(() => {
    if (isModalopen && editData) {
      setValue("mastername", editData.mastername);
      setValue("remarks", editData.remarks);
      setValue("subdata", editData.subdata);
    } else {
      reset();
    }
  }, [isModalopen, editData]);

  const { fields, append, remove } = useFieldArray({
    control,
    name: "subdata",
  });

  const onSubmit = async (data: FormType) => {
    try {
      setLoading(true);
      const payload: CommonMasterPayload = {
        ...data,
        masterid: editData?.masterid || "",
      };
      const response: CommonApiInterface = await request({
        url: apis.ADMIN.saveMasterData,
        method: "POST",
        body: payload,
      }).unwrap();
      if (response?.statuscode === 401) {
        router.push("/login");
      }
      if (response?.success) {
        await fetchgridData();
        setIsModalopen(false);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title={
        <div className="flex items-center gap-3">
          <span className="text-white text-lg font-semibold">
            Add Common Master
          </span>
        </div>
      }
      open={isModalopen}
      onCancel={() => setIsModalopen(false)}
      centered
      width={900}
      className="dark-modal rounded-xl"
      footer={[
        <CommonButton
          themeType="cancel"
          onClick={() => setIsModalopen(false)}
          icon={<RxCross1 />}
          key="cancel"
        >
          Cancel
        </CommonButton>,
        <CommonButton
          themeType="dark"
          icon={<FaSave />}
          onClick={handleSubmit(onSubmit)}
          key="save"
          htmlType="submit"
          form="commonmasterform"
        >
          Save
        </CommonButton>,
      ]}
    >
      <form onSubmit={handleSubmit(onSubmit)} id="commonmasterform">
        <CommonInput
          focusColor="blue"
          id="mastername"
          label="Master Name"
          {...register("mastername")}
          placeholder="Enter master name"
          maxLength={500}
          errorMessage={errors.mastername?.message}
          className="mb-3"
        />

        <CommonInput
          focusColor="blue"
          id="remarks"
          label="Remarks"
          {...register("remarks")}
          placeholder="Enter remarks"
          maxLength={500}
          errorMessage={errors.remarks?.message}
          className="mb-3"
        />
        <div className="border rounded-lg p-4">
          <div className="flex justify-between mb-3">
            <h3 className="font-semibold text-lg">Sub Data</h3>
            <CommonButton
              themeType="primary"
              icon={<FaPlus />}
              key="save"
              onClick={() => append({ keyid: "", keyvalue: "" })}
              children="Add Value"
            />
          </div>

          {/* Rows */}
          {fields.map((item, index) => (
            <div
              key={item.id}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-center mb-3"
            >
              {/* Key ID */}

              <CommonInput
                focusColor="blue"
                id={`subdata.${index}.keyid`}
                label="Key ID"
                {...register(`subdata.${index}.keyid`)}
                placeholder="Enter key Id"
                maxLength={500}
                errorMessage={errors.subdata?.[index]?.keyid?.message}
                className="mb-3"
              />
              <CommonInput
                focusColor="blue"
                id={`subdata.${index}.keyvalue`}
                label="Key Value"
                {...register(`subdata.${index}.keyvalue`)}
                placeholder="Enter Key Value"
                maxLength={500}
                errorMessage={errors.subdata?.[index]?.keyvalue?.message}
                className="mb-3"
              />

              <div>
                {fields?.length > 1 && (
                  <CommonButton
                    themeType="danger"
                    icon={<FaMinus />}
                    onClick={() => remove(index)}
                    children="Remove"
                  />
                )}
              </div>
            </div>
          ))}
        </div>

        {errors.subdata && (
          <p className="text-red-500 mt-2 text-sm">
            {errors.subdata.message as string}
          </p>
        )}
      </form>
    </Modal>
  );
};

export default AddCommonMasterModal;
