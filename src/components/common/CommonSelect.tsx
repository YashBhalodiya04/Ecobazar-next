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
      valueKey = "value",
      labelKey = "label",
      id,
      containerRef,
      showSearch = true,
    },
    ref // This is the forwarded ref
  ) => {
    const [Open, setOpen] = useState<boolean>(false);

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
    const handleDropdownVisibleChange = (open: boolean) => {
      if (open) {
        setTimeout(() => {
          const dropdown = document.querySelector(".ant-select-dropdown");
          (dropdown as HTMLElement | null)?.focus();
        }, 0);
      }
      if (open) {
        setTimeout(() => {
          const dropdown = document.querySelector(".rc-virtual-list");
          dropdown?.scrollIntoView({ block: "nearest" });
        }, 0);
      }
    };

    return (
      <div ref={refmain}>
        <Select
          value={value ? value[valueKey] : undefined}
          defaultValue={defaultValue ? defaultValue[valueKey] : undefined}
          allowClear
          showSearch={showSearch}
          id={id}
          open={Open}
          className={"w-100 " + className}
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
          onDropdownVisibleChange={handleDropdownVisibleChange}
        />
      </div>
    );
  }
);

export default CommonSelect;
