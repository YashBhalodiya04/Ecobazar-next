"use client";
import React, { useEffect } from "react";
import { Modal, Input } from "antd";
import { FaPlus, FaTrash, FaSave } from "react-icons/fa";
import CommonButton from "@/components/common/CommonButton";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ProductGrigRecord } from "@/interfaces/ProductInterface";
import {
  ProductAdditionalInfoSchema,
  ProductAdditionalInfoType,
} from "@/schemas/authSchemas";
import CommonInput from "@/components/common/CommonInput";
import { RxCross1 } from "react-icons/rx";
import { CommonApiInterface } from "@/interfaces/commonInterace";
import { useRouter } from "next/navigation";
import { useRequestMutation } from "@/redux/commonApi";
import { apis } from "@/redux/apiUrls";

interface ModalProps {
  isModalOpen: boolean;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  editData: ProductGrigRecord | null;
  ferchGridData: () => void;
}

const FieldsSection = ({
  sectionIndex,
  control,
  register,
  errors,
}: {
  sectionIndex: number;
  control: any;
  register: any;
  errors: any;
}) => {
  const {
    fields,
    append: appendField,
    remove: removeField,
  } = useFieldArray({
    control,
    name: `sections.${sectionIndex}.fields`,
    keyName: "fieldKeyId",
  });

  const addNewField = () => {
    appendField({
      id: Date.now().toString(),
      label: "",
      value: "",
    });
  };

  return (
    <div>
      {fields.map((field, fieldIndex) => (
        <div key={field.fieldKeyId} className="flex gap-2 mb-2 items-start">
          <div className="flex-1">
            <CommonInput
              id={`section-${sectionIndex}-field-${fieldIndex}-label`}
              label="Label"
              type="text"
              placeholder="Enter label"
              {...register(
                `sections.${sectionIndex}.fields.${fieldIndex}.label`
              )}
              errorMessage={
                errors.sections?.[sectionIndex]?.fields?.[fieldIndex]?.label
                  ?.message
              }
              focusColor="blue"
              islabelShow={fieldIndex === 0}
            />
          </div>
          <div className="flex-1">
            <CommonInput
              id={`section-${sectionIndex}-field-${fieldIndex}-value`}
              label="Value"
              type="text"
              placeholder="Enter value"
              {...register(
                `sections.${sectionIndex}.fields.${fieldIndex}.value`
              )}
              errorMessage={
                errors.sections?.[sectionIndex]?.fields?.[fieldIndex]?.value
                  ?.message
              }
              focusColor="blue"
              islabelShow={fieldIndex === 0}
            />
          </div>
          {fields.length > 1 && (
            <CommonButton
              themeType="danger"
              onClick={() => removeField(fieldIndex)}
              icon={<FaTrash />}
              className="mt-6"
            >
              Remove
            </CommonButton>
          )}
        </div>
      ))}
      <CommonButton
        themeType="dark"
        icon={<FaPlus />}
        onClick={addNewField}
        className="mt-3"
      >
        Add Field
      </CommonButton>
    </div>
  );
};

const AddOtherInformationModal = ({
  isModalOpen,
  setIsModalOpen,
  editData,
  ferchGridData,
  setLoading,
}: ModalProps) => {
  const router = useRouter();
  const [request, { isLoading }] = useRequestMutation();
  const {
    control,
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = useForm<ProductAdditionalInfoType>({
    resolver: zodResolver(ProductAdditionalInfoSchema),
    defaultValues: {
      sections: [
        {
          id: Date.now().toString(),
          title: "",
          fields: [{ id: Date.now().toString(), label: "", value: "" }],
        },
      ],
    },
  });

  useEffect(() => {
    if (editData && editData?.additionalInfo?.length > 0 && isModalOpen) {
      const otherData = editData?.additionalInfo?.map((item) => {
        return {
          id: Date.now().toString(),
          title: item?.title,
          srno: item?.id,
          fields: item?.fields?.map((field) => ({
            id: Date.now().toString(),
            srno: field?.id,
            label: field?.label,
            value: field?.value,
          })),
        };
      });
      reset({ sections: otherData });
    } else {
      reset({ sections: [] });
    }
  }, [isModalOpen, editData]);

  const {
    fields: sections,
    append: appendSection,
    remove: removeSection,
  } = useFieldArray({
    control,
    name: "sections",
    keyName: "sectionKeyId",
  });

  const addNewSection = () => {
    appendSection({
      id: Date.now().toString(),
      title: "",
      fields: [
        {
          id: (Date.now() + 1).toString(),
          label: "",
          value: "",
        },
      ],
    });
  };

  const onSubmit = async (data: ProductAdditionalInfoType) => {
    const additionalInfo = data?.sections.map((section) => ({
      id: section?.srno ? section?.srno : "",
      title: section.title,
      fields: section.fields.map((f) => ({
        id: f?.srno ? f?.srno : "",
        label: f.label,
        value: f.value,
      })),
    }));

    const payload = {
      name: editData?.name,
      description: editData?.description,
      price: Number(editData?.price),
      categoryid: editData?.categoryid || "",
      stock: Number(editData?.stock),
      productid: editData?.id,
      active: editData?.active,
      images: editData?.images,
      offer: editData?.offer,
      additionalInfo: additionalInfo,
    };
    const formdata = new FormData();
    formdata.append("data", JSON.stringify(payload));
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
        await ferchGridData();
        setIsModalOpen(false);
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
        <span className="text-white text-lg font-semibold">
          Add Other Information
        </span>
      }
      open={isModalOpen}
      onCancel={() => setIsModalOpen(false)}
      footer={[
        <CommonButton
          themeType="cancel"
          onClick={() => {
            reset();
            setIsModalOpen(false);
          }}
          icon={<RxCross1 />}
          children="Cancel"
          key="cancel"
          className="mt-3"
        />,
        <CommonButton
          themeType="dark"
          form="addOtherInformation"
          htmlType="submit"
          icon={<FaSave />}
          key="save"
          onClick={handleSubmit(onSubmit)}
          children={
            editData && editData?.additionalInfo?.length > 0 ? "Update" : "Add"
          }
        />,
      ]}
      centered
      width="100%"
      className="dark-modal rounded-none p-0"
    >
      <form onSubmit={handleSubmit(onSubmit)} id="addOtherInformation">
        {sections.map((section, sectionIndex) => (
          <div
            key={section.sectionKeyId}
            className="border border-gray-600 p-4 rounded-lg mb-4"
          >
            <div className="flex justify-between items-center mb-3 gap-4">
              <div className="flex-1">
                <CommonInput
                  id={`section-title-${section.id}`}
                  label="Section Title"
                  type="text"
                  placeholder="Enter section title"
                  {...register(`sections.${sectionIndex}.title`)}
                  errorMessage={errors.sections?.[sectionIndex]?.title?.message}
                  focusColor="blue"
                  required
                />
              </div>
              {sections.length > 1 && (
                <CommonButton
                  themeType="danger"
                  onClick={() => removeSection(sectionIndex)}
                  icon={<FaTrash />}
                >
                  Delete Section
                </CommonButton>
              )}
            </div>

            {/* Nested Fields Section */}
            <FieldsSection
              sectionIndex={sectionIndex}
              control={control}
              register={register}
              errors={errors}
            />
          </div>
        ))}

        <CommonButton
          themeType="dark"
          icon={<FaPlus />}
          onClick={addNewSection}
        >
          Add New Section
        </CommonButton>
      </form>
    </Modal>
  );
};

export default AddOtherInformationModal;
