import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  sideBar: false,
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    toggleSidebar(state) {
      state.sideBar = !state.sideBar;
    },
  },
});

export const { toggleSidebar } = uiSlice.actions;

export default uiSlice.reducer;
