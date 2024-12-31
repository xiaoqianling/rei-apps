import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState ={
  name: '',
  email: '',
  avatar: '',
}

type State = typeof initialState;
type Payload = typeof initialState;

export const slice = createSlice({
  name: '',
  initialState,
  reducers: {
    setUserInfo: (state: State, action:PayloadAction<Payload>) => {
      state.name = action.payload.name;
      state.email = action.payload.email;
      state.avatar = action.payload.avatar;
    },
  },
});

export const { setUserInfo } = slice.actions;