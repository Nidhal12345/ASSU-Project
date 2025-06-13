// store/quoteSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface QuoteState {
  data: any; // Replace with your actual quote type if you have it
  files: File[]; // File objects from inputs
}

const initialState: QuoteState = {
  data: null,
  files: [],
};

const quoteSlice = createSlice({
  name: "quote",
  initialState,
  reducers: {
    setQuoteData(state, action: PayloadAction<any>) {
      state.data = action.payload;
    },
    setQuoteFiles(state, action: PayloadAction<File[]>) {
      state.files = action.payload;
    },
    clearQuote(state) {
      state.data = null;
      state.files = [];
    },
  },
});

export const { setQuoteData, setQuoteFiles, clearQuote } = quoteSlice.actions;
export default quoteSlice.reducer;
