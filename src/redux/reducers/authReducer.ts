import { createSlice } from "@reduxjs/toolkit";
import { localDataName } from "../../constants/appInfo";

// export interface CounterState {
//   value: number;
// }

export interface AuthState {
  token: string;
  _id: string;
  name: string;
  rule: number;
}

const initialState: AuthState = {
  _id: "",
  token: "",
  name: "",
  rule: 0,
};

const syncLocal = (data: any) => {
  localStorage.setItem(localDataName.authData, JSON.stringify(data));
};

export const authSlice = createSlice({
  name: "auth",
  initialState: {
    data: initialState,
  },
  reducers: {
    addAuth: (state, action) => {
      state.data = action.payload;
      syncLocal(action.payload);
    },
    removeAuth: (state, action) => {
      state.data = initialState;
      syncLocal({});
    },
    refreshToken: (state, action) => {
      state.data.token = action.payload;
    },
  },
});

export const { addAuth, removeAuth, refreshToken } = authSlice.actions;
export default authSlice.reducer;
