import { AnchorItem } from "@/src/components";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: {
  anchorItems: AnchorItem[];
} = { anchorItems: [] };

type State = typeof initialState;
type Payload = typeof initialState;

export const anchorSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setAnchorItems: (state: State, action: PayloadAction<Payload>) => {
      state.anchorItems = action.payload.anchorItems;
    },
    clearAnchorItems: (state: State) => {
      state.anchorItems = [];
    },
  },
});

export const { setAnchorItems, clearAnchorItems } = anchorSlice.actions;
