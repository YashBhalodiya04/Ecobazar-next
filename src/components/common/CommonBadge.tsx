"use client";

import { Badge } from "antd";

type BadgeColorMap = Record<string, string>;

interface CommonBadgeProps {
  value: string;
  colorMap: BadgeColorMap;
  capitalize?: boolean;
}

export default function CommonBadge({ value, colorMap, capitalize = true }: CommonBadgeProps) {
  const label = capitalize
    ? value?.charAt(0).toUpperCase() + value?.slice(1)
    : value;
  return (
    <Badge
      color={'green'}
      text={label}
    />
  );
}
