"use client";
import React from "react";
import { Button, ButtonProps } from "antd";
import clsx from "clsx";

interface CommonButtonProps extends Omit<ButtonProps, "variant"> {
  themeType?:
    | "dark"
    | "primary"
    | "cancel"
    | "danger"
    | "success"
    | "warning"
    | "info"
    | "outline";
}
const CommonButton: React.FC<CommonButtonProps> = ({
  themeType = "dark",
  className,
  children,
  ...rest
}) => {
  const themeClass = {
    dark: "btn-dark",
    primary: "btn-primary-dark",
    cancel: "btn-cancel-dark",
    danger: "btn-danger-dark",
    success: "btn-success-dark",
    warning: "btn-warning-dark",
    info: "btn-info-dark",
    outline: "btn-outline-dark",
  }[themeType];

  return (
    <Button className={clsx(themeClass, className)} {...rest}>
      {children}
    </Button>
  );
};

export default CommonButton;
