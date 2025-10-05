"use client";
import { toast, ToastOptions } from "react-hot-toast";

const defaultOptions: ToastOptions = {
  position: "bottom-right",
  duration: 3000,
  style: {
    borderRadius: "8px",
    padding: "10px 16px",
    color: "#fff",
    fontWeight: 500,
  },
};

export const Toast = {
  success: (message: string, options?: ToastOptions) =>
    toast.success(message, {
      ...defaultOptions,
      ...options,
      style: {
        ...defaultOptions.style,
        background: "#16a34a",
        ...(options?.style || {}),
      },
    }),

  error: (message: string, options?: ToastOptions) =>
    toast.error(message, {
      ...defaultOptions,
      ...options,
      style: {
        ...defaultOptions.style,
        background: "#dc2626",
        ...(options?.style || {}),
      },
    }),

  info: (message: string, options?: ToastOptions) =>
    toast(message, {
      ...defaultOptions,
      ...options,
      style: {
        ...defaultOptions.style,
        background: "#2563eb",
        ...(options?.style || {}),
      },
    }),
};
