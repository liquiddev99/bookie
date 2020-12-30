import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  sideBar: true,
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
