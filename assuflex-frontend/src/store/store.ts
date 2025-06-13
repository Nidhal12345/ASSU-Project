// store/store.ts
import { configureStore } from "@reduxjs/toolkit";
import quoteReducer from "./quoteSlice";

export const store = configureStore({
  reducer: {
    quote: quoteReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // ✅ Allow files in Redux
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
