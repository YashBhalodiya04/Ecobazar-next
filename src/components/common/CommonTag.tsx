"use client";

import { Tag } from "antd";

type TagColorMap = Record<string, string>;

interface CommonTagProps {
  value: string;
  colorMap: TagColorMap;
  capitalize?: boolean;
  bordered?: boolean;
}

export default function CommonTag({
  value,
  colorMap,
  capitalize = true,
  bordered = false,
}: CommonTagProps) {
  const label = capitalize
    ? value?.charAt(0).toUpperCase() + value?.slice(1)
    : value;

  return (
    <Tag color={colorMap[value] || "default"} bordered={true} className="!bg-transparent border-2 font-semibold" >
      {label}
    </Tag>
  );
}
