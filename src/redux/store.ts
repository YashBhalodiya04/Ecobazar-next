'use client'

// src/redux/store.ts
import { configureStore } from "@reduxjs/toolkit";
import { api } from "./api"; // your RTK Query api slice

export const store = configureStore({
  reducer: {
    [api.reducerPath]: api.reducer,
    // add other reducers here
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(api.middleware),
});

// Export types for TS
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
