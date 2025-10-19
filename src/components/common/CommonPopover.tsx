"use client";
import React from "react";
import { Popover } from "antd";
import clsx from "clsx";

interface CommonPopoverProps {
  title?: React.ReactNode;
  content: React.ReactNode;
  children: React.ReactNode;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  placement?:
    | "top"
    | "topLeft"
    | "topRight"
    | "bottom"
    | "bottomLeft"
    | "bottomRight"
    | "left"
    | "leftTop"
    | "leftBottom"
    | "right"
    | "rightTop"
    | "rightBottom";
  className?: string;
}

const CommonPopover: React.FC<CommonPopoverProps> = ({
  title,
  content,
  children,
  open,
  setOpen,
  placement = "bottomRight",
  className,
}) => {
  const handleOpenChange = (newOpen: boolean) => setOpen(newOpen);

  return (
    <Popover
      title={title}
      trigger="click"
      placement={placement}
      open={open}
      onOpenChange={handleOpenChange}
      overlayClassName={clsx("dark-popover", className)}
      content={content}
    >
      {children}
    </Popover>
  );
};

export default CommonPopover;
