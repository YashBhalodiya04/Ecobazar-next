'use client'

import { api } from "./api";

export const commonApi = api.injectEndpoints({
  endpoints: (builder) => ({
    request: builder.mutation<any, any>({
      query: ({ url, method = "POST", body, headers, params }) => ({
        url,
        method,
        body,
        headers,
        params,
      }),
      invalidatesTags: ["Common"],
    }),
  }),
});

export const { useRequestMutation } = commonApi;
