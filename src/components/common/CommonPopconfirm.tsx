"use client";

import React, { ReactNode } from "react";
import { Popconfirm, Button } from "antd";
import { FaExclamationTriangle } from "react-icons/fa";

interface CommonPopconfirmProps {
  title?: string;
  description?: string | ReactNode;
  onConfirm: () => void | Promise<void>;
  okText?: string;
  cancelText?: string;
  okButtonProps?: any;
  cancelButtonProps?: any;
  icon?: ReactNode;
  className?: string; // ✅ new prop for custom classes
  children: ReactNode; // The trigger element, e.g., Button
}

const CommonPopconfirm: React.FC<CommonPopconfirmProps> = ({
  title = "Are you sure?",
  description,
  onConfirm,
  okText = "Yes",
  cancelText = "No",
  okButtonProps,
  cancelButtonProps,
  icon = <FaExclamationTriangle style={{ color: "#FFA500" }} />,
  className = "", // default empty
  children,
}) => {
  return (
    <Popconfirm
      title={<span className="text-gray-200">{title}</span>}
      description={description ? <span className="text-gray-400">{description}</span> : undefined}
      onConfirm={onConfirm}
      okText={okText}
      cancelText={cancelText}
      className="dark-popconfirm"
      okButtonProps={{
        ...okButtonProps,
        className: `!bg-red-600 !text-white hover:!bg-red-500 ${okButtonProps?.className || ""}`,
      }}
      cancelButtonProps={{
        ...cancelButtonProps,
        className: `!bg-gray-700 !text-gray-200 hover:!bg-gray-600 ${cancelButtonProps?.className || ""}`,
      }}
      icon={icon}
      overlayClassName={`dark-popconfirm ${className}`} // ✅ merge with passed className
    >
      {children}
    </Popconfirm>
  );
};

export default CommonPopconfirm;
