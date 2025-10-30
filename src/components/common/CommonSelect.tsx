"use client";
import React, {
  forwardRef,
  KeyboardEvent,
  useMemo,
  useRef,
  useState,
} from "react";
import { Select } from "antd";

interface OptionType {
  [key: string]: any;
}

interface SingleSelectProps {
  options: OptionType[];
  onChange: (selectedOption: any) => void; // Pass the entire object or null
  placeholder?: string;
  defaultValue?: OptionType;
  value?: OptionType | null;
  disabled?: boolean;
  className?: string;
  valueKey?: string; // Custom key for value
  labelKey?: string; // Custom key for label
  id?: string;
  showSearch?: boolean;
  containerRef?: React.RefObject<HTMLDivElement>; // Ref for the container
  focusColor?: "green" | "blue";
}

const CommonSelect = forwardRef<HTMLDivElement, SingleSelectProps>(
  (
    {
      options = [],
      onChange,
      defaultValue,
      disabled = false,
      value,
      placeholder = "Select an option",
      className = "",
      valueKey = "id",
      labelKey = "value",
      id,
      containerRef,
      showSearch = true,
      focusColor = "green",
    },
    ref // This is the forwarded ref
  ) => {
    const [Open, setOpen] = useState<boolean>(false);

    const focusClasses =
      focusColor === "green"
        ? "[&_.ant-select-selector:focus-within]:!border-green-500 [&_.ant-select-selector:focus-within]:!ring-1 [&_.ant-select-selector:focus-within]:!ring-green-700"
        : "[&_.ant-select-selector:focus-within]:!border-blue-500 [&_.ant-select-selector:focus-within]:!ring-1 [&_.ant-select-selector:focus-within]:!ring-blue-700";

    const themeClasses =
      focusColor === "green"
        ? "[&_.ant-select-selector]:!text-white [&_.ant-select-selector]:!border-gray-400 [&_.ant-select-arrow]:!text-gray-600 [&_.ant-select-selection-placeholder]:!text-gray-500"
        : "[&_.ant-select-selector]:!text-white [&_.ant-select-selector]:!border-white/40 [&_.ant-select-arrow]:!text-white [&_.ant-select-selection-placeholder]:!text-white/50";

    const refmain = useRef(null);

    const memoizedOptions = useMemo(() => options, [options]);
    const handleChange = (selectedValue: string | undefined) => {
      if (selectedValue === undefined) {
        onChange(null); // Call onChange with null when cleared
      } else {
        const selectedOption = options.find(
          (option) => option[valueKey as keyof OptionType] === selectedValue
        );
        if (selectedOption) {
          onChange(selectedOption); // Pass the entire object
        }
      }
      setOpen(false);
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
      if (e.key === "ArrowDown") {
        setOpen(true);
      }
    };

    return (
      <div ref={refmain} className={`w-full `}>
        <Select
          value={value ? value[valueKey] : undefined}
          defaultValue={defaultValue ? defaultValue[valueKey] : undefined}
          allowClear
          showSearch={showSearch}
          id={id}
          open={Open}
          className={`w-full ${themeClasses} ${className}`}
          placeholder={placeholder}
          disabled={disabled}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          getPopupContainer={() => refmain?.current || document.body} // Use passed ref or default to body
          filterOption={(input, option) => {
            setOpen(true);
            return (option?.label ?? "")
              .toString()
              .toLowerCase()
              .includes(input.toLowerCase());
          }}
          options={
            Array.isArray(memoizedOptions)
              ? memoizedOptions.map((option) => ({
                  value: option[valueKey as keyof OptionType],
                  label: option[labelKey as keyof OptionType],
                  disabled: option?.disabled, // Pass the disabled field
                }))
              : []
          }
          // onFocus={() => setOpen(true)}
          onClick={() => setOpen(!Open)}
          onBlur={() => setOpen(false)}
        />
      </div>
    );
  }
);

export default CommonSelect;
