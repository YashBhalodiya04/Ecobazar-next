"use client";
import { InputHTMLAttributes, useState } from "react";
import Link from "next/link";
import { MdVisibility, MdVisibilityOff } from "react-icons/md"; // Using Material icons

interface CommonInputProps extends InputHTMLAttributes<HTMLInputElement> {
  id: string;
  label: string;
  errorMessage?: string;
  isForgate?: boolean;
  isPassword?: boolean;
  focusColor?: "green" | "blue";
}

const CommonInput: React.FC<CommonInputProps> = ({
  id,
  label,
  errorMessage,
  isForgate,
  isPassword = false,
  focusColor = "green",
  ...rest
}) => {
  const [showPassword, setShowPassword] = useState<boolean>(true);

  const togglePassword = () => setShowPassword(!showPassword);
  const focusClasses =
    focusColor === "green"
      ? "focus:ring-1 focus:ring-green-700 focus:border-green-500"
      : "focus:ring-1 focus:ring-blue-700 focus:border-blue-500";

  return (
    <div className="w-full relative">
      <div className="flex items-center justify-between">
        <label htmlFor={id} className="text-base font-medium text-white/90">
          {label}
        </label>
        {isForgate && (
          <Link
            href="/"
            className="text-sm font-semibold hover:underline text-green-400"
          >
            Forgot password?
          </Link>
        )}
      </div>

      <div className="mt-2 relative">
        <input
          type={isPassword ? (!showPassword ? "text" : "password") : "text"}
          id={id}
          // className="w-full px-3 py-2 rounded-md bg-transparent border border-white/40 placeholder:text-white/50 text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
          className={`w-full px-3 py-2 rounded-md bg-transparent border border-white/40 placeholder:text-white/50 text-white focus:outline-none ${focusClasses}`}
          {...rest}
        />
        {isPassword && (
          <button
            type="button"
            onClick={togglePassword}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60 hover:text-white"
          >
            {showPassword ? (
              <MdVisibilityOff size={20} />
            ) : (
              <MdVisibility size={20} />
            )}
          </button>
        )}
      </div>

      {errorMessage && (
        <span className="mt-1 text-sm text-red-600">{errorMessage}</span>
      )}
    </div>
  );
};

export default CommonInput;
