'use client'

import { api } from "./api";

export const commonApi = api.injectEndpoints({
  endpoints: (builder) => ({
    request: builder.mutation<any, { url: string; body?: any; headers?: any; isencrypted?: boolean; responseType?: any, method?: string }>({
      query: ({ url, body, headers, isencrypted, responseType, method }) => ({
        url,
        method: method || "POST",
        body: body,
        headers,
        isencrypted: isencrypted || false,
        responseType: responseType || "json",
      }),
    }),
  }),
});

export const { useRequestMutation } = commonApi;
