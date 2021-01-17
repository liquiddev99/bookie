import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  sideBar: false,
  account: false,
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    toggleSidebar(state) {
      state.sideBar = !state.sideBar;
    },
    toggleAccount(state, action) {
      state.account = !state.account;
    },
  },
});

export const { toggleSidebar, toggleAccount } = uiSlice.actions;

export default uiSlice.reducer;
