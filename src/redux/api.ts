'use client'
import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithMiddleware } from "./baseQueryWithMiddleware";

export const api = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithMiddleware,
  tagTypes: ["Common"],
  endpoints: () => ({}),
});
