"use client";
import { Toast } from "@/components/common/toastUtils";
import { SignInResponseData } from "@/interfaces/SignInInterface";
import { fetchBaseQuery, BaseQueryFn } from "@reduxjs/toolkit/query";
import type { FetchArgs, FetchBaseQueryError } from "@reduxjs/toolkit/query";

export const baseQueryWithMiddleware: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  const rawBaseQuery = fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || "",
    prepareHeaders: (headers) => {
      const token: SignInResponseData = JSON.parse(
        localStorage.getItem("user") || "{}"
      );
      headers.set("Authorization", `Bearer ${token?.token}`);
      headers.set("Content-Type", "application/json");
      return headers;
    },
  });

  try {
    const result: any = await rawBaseQuery(args, api, extraOptions);
    if (result?.data?.success === false) {
      Toast.error(result?.data?.message || "An unexpected error occurred");
    }
    if (result.error) {
      const err = result.error;

      // Handle error based on status code
      switch (err.status) {
        case 400:
          Toast.error("Bad Request");
          break;
        case 401:
          Toast.error("Unauthorized. Redirecting to login...");
          localStorage.removeItem("token");
          api.dispatch({ type: "auth/clearToken" });
          window.location.assign(`${window.location.origin}/login`);
          break;
        case 403:
          Toast.error("Forbidden");
          break;
        case 404:
          Toast.error("Resource Not Found");
          break;
        case 500:
          Toast.error("Internal Server Error");
          break;
        default:
          Toast.error(
            err?.data ? String(err.data) : "An unexpected error occurred"
          );
      }

      console.error("API Error:", err);
    }

    return result;
  } catch (err: unknown) {
    // Properly format custom error according to FetchBaseQueryError type
    const customError: FetchBaseQueryError = {
      status: "CUSTOM_ERROR",
      data: err instanceof Error ? err.message : err,
      error: err instanceof Error ? err.message : "Unknown error",
    };
    console.error("Unexpected Error:", customError);
    Toast.error(customError.error);
    return { error: customError };
  }
};
