"use client";
import { Toast } from "@/components/common/toastUtils";
import { SignInResponseData } from "@/interfaces/SignInInterface";
import encryptDecryptUtil from "@/lib/encrypt-decrypt-utils";
import { fetchBaseQuery, BaseQueryFn } from "@reduxjs/toolkit/query";
import type { FetchArgs, FetchBaseQueryError } from "@reduxjs/toolkit/query";

export const baseQueryWithMiddleware: BaseQueryFn<
  FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  const rawBaseQuery = fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || "",
    prepareHeaders: (headers) => {
      // ✅ Remove manual multipart content-type
      if (!(args?.body instanceof FormData)) {
        headers.set("Content-Type", "application/json");
      }

      return headers;
    },
  });

  let newbody = args?.body;

  if (args?.body && !(args?.body instanceof FormData)) {
    newbody = encryptDecryptUtil.encryptForBackend(JSON.stringify(args?.body));
  }

  if (args?.body instanceof FormData) {
    const newFormData = new FormData();
    let hasFile = true;

    // args.body.forEach((value: any) => {
    //   if (value instanceof File || value instanceof Blob) {
    //     hasFile = true;
    //   }
    // });

    if (hasFile) {
      args.body.forEach((value: any, key) => {
        if (value instanceof File || value instanceof Blob) {
          newFormData.append(key, value);
        } else {
          try {
            const parsed = JSON.parse(value);
            const encrypted = encryptDecryptUtil.encryptForBackend(
              JSON.stringify(parsed)
            );
            newFormData.append(key, encrypted);
          } catch {
            newFormData.append(key, value);
          }
        }
      });

      newbody = newFormData;
    }
    // else {
    //   const plainObj: Record<string, any> = {};
    //   args.body.forEach((value: any, key) => (plainObj[key] = value));
    //   newbody = encryptDecryptUtil.encryptForBackend(JSON.stringify(plainObj));
    // }
  } else if (args?.body) {
    newbody = encryptDecryptUtil.encryptForBackend(JSON.stringify(args.body));
  }

  try {
    const result: any = await rawBaseQuery(
      { ...args, body: newbody },
      api,
      extraOptions
    );
    const newResult = {
      data: result?.data?.data
        ? encryptDecryptUtil.decryptJSData(result?.data?.data)
        : null,
      success: result?.data?.success,
      message: result?.data?.message,
      statuscode: result?.data?.statuscode,
    };

    const finalrespinse = {
      ...result,
      data: newResult,
    };
    if (result?.data?.success === false && result?.data?.message) {
      Toast.error(result?.data?.message || "An unexpected error occurred");
    }
    if (result?.data?.success === true && result?.data?.message) {
      Toast.success(result?.data?.message || "An unexpected error occurred");
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

    return finalrespinse;
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
