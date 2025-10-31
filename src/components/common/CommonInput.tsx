"use client";
import React, { InputHTMLAttributes, TextareaHTMLAttributes, useState } from "react";
import Link from "next/link";
import { MdVisibility, MdVisibilityOff } from "react-icons/md";
import clsx from "clsx";

// ✅ Combine input + textarea props
type CommonInputProps = {
  id: string;
  label: string;
  errorMessage?: string;
  isForgate?: boolean;
  isPassword?: boolean;
  focusColor?: "green" | "blue";
  render?: React.ReactNode;
  required?: boolean;
  islabelShow?: boolean;
  labelClassName?: string;
  istexarea?: boolean;
} & (
  | InputHTMLAttributes<HTMLInputElement>
  | TextareaHTMLAttributes<HTMLTextAreaElement>
);

const CommonInput: React.FC<CommonInputProps> = ({
  id,
  label,
  errorMessage,
  isForgate,
  isPassword = false,
  focusColor = "green",
  render,
  required = false,
  islabelShow = true,
  className,
  labelClassName,
  istexarea = false,
  ...rest
}) => {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const togglePassword = () => setShowPassword((prev) => !prev);

  const focusClasses =
    focusColor === "green"
      ? "focus:ring-1 focus:ring-green-700 focus:border-green-500 hover:border-green-500"
      : "focus:ring-1 focus:ring-blue-700 focus:border-blue-500 hover:border-blue-500";

  return (
    <div className="w-full relative">
      {/* Label + Forgot Password */}
      <div className="flex items-center justify-between">
        {islabelShow && (
          <label
            htmlFor={id}
            className={clsx("text-base font-medium text-gray-900 dark:text-white/90", labelClassName)}
          >
            {label} {required && <span className="text-red-500">*</span>}
          </label>
        )}
        {isForgate && (
          <Link href="/" className="text-sm font-semibold text-green-600 hover:underline">
            Forgot password?
          </Link>
        )}
      </div>

      {/* Input or Textarea */}
      <div className="mt-2 relative">
        {render ? (
          render
        ) : istexarea ? (
          <textarea
            id={id}
            className={clsx(
              "w-full px-3 py-2 rounded-md border outline-none transition-all duration-200 resize-none",
              "bg-white text-gray-900 placeholder:text-gray-400 border-gray-300",
              "dark:bg-transparent dark:text-white dark:placeholder:text-white/50 dark:border-white/30",
              focusClasses,
              className
            )}
            {...(rest as TextareaHTMLAttributes<HTMLTextAreaElement>)}
          />
        ) : (
          <>
            <input
              type={isPassword ? (showPassword ? "text" : "password") : "text"}
              id={id}
              className={clsx(
                "w-full px-3 py-2 rounded-md border outline-none transition-all duration-200",
                "bg-white text-gray-900 placeholder:text-gray-400 border-gray-300",
                "dark:bg-transparent dark:text-white dark:placeholder:text-white/50 dark:border-white/30",
                focusClasses,
                className
              )}
              {...(rest as InputHTMLAttributes<HTMLInputElement>)}
            />
            {isPassword && (
              <button
                type="button"
                onClick={togglePassword}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-white/60 hover:text-gray-700 dark:hover:text-white"
              >
                {!showPassword ? <MdVisibilityOff size={20} /> : <MdVisibility size={20} />}
              </button>
            )}
          </>
        )}
      </div>

      {/* Error message */}
      {errorMessage && <span className="mt-1 text-sm text-red-600">{errorMessage}</span>}
    </div>
  );
};

export default CommonInput;
