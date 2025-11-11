"use client";
import React, {
  InputHTMLAttributes,
  TextareaHTMLAttributes,
  useState,
} from "react";
import Link from "next/link";
import { MdVisibility, MdVisibilityOff } from "react-icons/md";
import clsx from "clsx";

type CommonInputProps = {
  id: string;
  label: string;
  errorMessage?: string;
  isForgate?: boolean;
  isPassword?: boolean;
  focusColor?: "green" | "blue" | "black";
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
  const [showPassword, setShowPassword] = useState(false);
  const togglePassword = () => setShowPassword((prev) => !prev);

  // 🎨 Define color theme variations
  const themeStyles =
    focusColor === "green"
      ? {
          base: "bg-transparent text-white placeholder:text-gray-400 border-white",
          dark: "text-white placeholder:text-white border-green-700",
          focus:
            "focus:ring-1 focus:ring-green-700 focus:border-green-500 hover:border-green-500",
        }
      : focusColor === "blue"
      ? {
          base: "bg-transparent text-white placeholder:text-white border-[#d9d9d9]",
          dark: "text-black placeholder:text-black border-[#d9d9d9]",
          focus:
            "focus:ring-1 focus:ring-blue-700 focus:border-blue-500 hover:border-blue-500",
        }
      : {
          base: "text-black placeholder:!text-black border-gray-400",
          dark: "text-black  border-black",
          focus:
            "focus:ring-1 focus:ring-green-50 focus:border-green-700 hover:border-green-700",
        };

  // const sharedClasses = clsx(
  //   "w-full px-3 py-2 rounded-md border outline-none transition-all duration-200",
  //   themeStyles.base,
  //   themeStyles.dark,
  //   themeStyles.focus,
  //   className
  // );
  const sharedClasses = clsx(
    "w-full px-3 py-2 rounded-md border outline-none transition-all duration-200",
    "disabled:bg-[#3a3a3a] disabled:text-gray-100 disabled:cursor-not-allowed disabled:border-gray-600 disabled:opacity-70", // ✅ Disabled Styles
    themeStyles.base,
    themeStyles.dark,
    themeStyles.focus,
    className
  );

  return (
    <div className="w-full relative">
      {/* Label + Forgot Password */}
      <div className="flex items-center justify-between">
        {islabelShow && (
          <label
            htmlFor={id}
            className={clsx(
              "text-base font-medium text-gray-900 dark:text-white/90",
              labelClassName
            )}
          >
            {label} {required && <span className="text-red-500">*</span>}
          </label>
        )}
        {isForgate && (
          <Link
            href="/forgotpassword"
            className="text-sm font-semibold text-green-600 hover:underline"
          >
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
            className={clsx(sharedClasses, "resize-none")}
            {...(rest as TextareaHTMLAttributes<HTMLTextAreaElement>)}
          />
        ) : (
          <>
            <input
              type={isPassword ? (showPassword ? "text" : "password") : "text"}
              id={id}
              className={sharedClasses}
              {...(rest as InputHTMLAttributes<HTMLInputElement>)}
            />
            {isPassword && (
              <button
                type="button"
                onClick={togglePassword}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-white/60 hover:text-gray-700 dark:hover:text-white"
              >
                {!showPassword ? (
                  <MdVisibilityOff size={20} />
                ) : (
                  <MdVisibility size={20} />
                )}
              </button>
            )}
          </>
        )}
      </div>

      {/* Error message */}
      {errorMessage && (
        <span className="mt-1 text-sm text-red-600">{errorMessage}</span>
      )}
    </div>
  );
};

export default CommonInput;
