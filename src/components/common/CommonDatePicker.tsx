"use client";

import React, { useRef } from "react";
import { DatePicker, DatePickerProps } from "antd";
import dayjs, { Dayjs } from "dayjs";
import { Controller, Control } from "react-hook-form";

interface CommonDatePickerProps extends DatePickerProps {
  id: string;
  label: string;
  control: Control<any>;
  name: string;
  errorMessage?: string;
  focusColor?: "green" | "blue";
  getPopupContainer?: (triggerNode: HTMLElement) => HTMLElement;
}

const CommonDatePicker: React.FC<CommonDatePickerProps> = ({
  id,
  label,
  control,
  name,
  errorMessage,
  focusColor = "green",
  getPopupContainer,
  ...props // <-- rest of AntD DatePicker props
}) => {
  const focusClass =
    focusColor === "green"
      ? "common-datepicker-green"
      : "common-datepicker-blue";

  const datepickerRef = useRef<HTMLDivElement>(null);

  return (
    <div className="w-full space-y-1" ref={datepickerRef}>
      <label htmlFor={id} className="block font-medium text-white/90">
        {label}
      </label>

      <Controller
        control={control}
        name={name}
        render={({ field }) => (
          <DatePicker
            {...props} // <-- spread all additional props here
            style={{ width: "100%" }}
            className={`common-datepicker ${focusClass} ${
              props.className ?? ""
            }`}
            value={field.value ? dayjs(field.value) : null}
            onChange={(date: Dayjs | null, _dateString: string | string[]) =>
              field.onChange(date ? date.toISOString() : "")
            }
            getPopupContainer={(triggerNode) => {
              const container = datepickerRef.current;
              if (container) {
                container.classList.add(
                  `${
                    focusColor === "green"
                      ? "ant-picker-dropdown-light"
                      : "ant-picker-dropdown-dark"
                  }`
                );
                return container;
              }
              return document.body;
            }}
          />
        )}
      />

      {errorMessage && (
        <span className="text-red-500 text-sm">{errorMessage}</span>
      )}
    </div>
  );
};

export default CommonDatePicker;
