import CommonButton from "@/components/common/CommonButton";
import CommonInput from "@/components/common/CommonInput";
import { CommonMasterGridRecord } from "@/interfaces/CommonMasterInterface";
import { Modal } from "antd";
import React from "react";
import { RxCross1 } from "react-icons/rx";

interface ModalProps {
  isModalOpen: boolean;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  masterData: CommonMasterGridRecord | null;
}
const ViewMasterValueModal = ({
  isModalOpen,
  setIsModalOpen,
  masterData,
}: ModalProps) => {
  return (
    <Modal
      title={
        <div className="flex items-center gap-3">
          <span className="text-white text-lg font-semibold">
            View Master {masterData?.mastername}
          </span>
        </div>
      }
      open={isModalOpen}
      onCancel={() => setIsModalOpen(false)}
      centered
      width={900}
      className="dark-modal rounded-xl"
      footer={[
        <CommonButton
          themeType="cancel"
          onClick={() => setIsModalOpen(false)}
          icon={<RxCross1 />}
          key="cancel"
        >
          Cancel
        </CommonButton>,
      ]}
    >
      <form>
        <CommonInput
          focusColor="blue"
          id="mastername"
          label="Master Name"
          placeholder="Enter master name"
          className="mb-3"
          value={masterData?.mastername || ""}
          disabled
        />

        <CommonInput
          focusColor="blue"
          id="remarks"
          label="Remarks"
          placeholder="Enter remarks"
          maxLength={500}
          className="mb-3"
          value={masterData?.remarks || ""}
          disabled
        />
        <div className="border rounded-lg p-4">
          {/* Rows */}
          {masterData?.subdata?.map((item, index) => (
            <div
              key={item?.keyid}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-center mb-3"
            >
              <CommonInput
                focusColor="blue"
                id={`subdata.${index}.keyid`}
                label="Key ID"
                placeholder="Enter key Id"
                maxLength={500}
                className="mb-3"
                value={item?.keyid || ""}
                disabled
              />
              <CommonInput
                focusColor="blue"
                id={`subdata.${index}.keyvalue`}
                label="Key Value"
                placeholder="Enter Key Value"
                maxLength={500}
                className="mb-3"
                value={item?.keyvalue || ""}
                disabled
              />
            </div>
          ))}
        </div>
      </form>
    </Modal>
  );
};

export default ViewMasterValueModal;
