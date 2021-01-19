import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  sideBar: false,
  toast: { display: false, type: "", msg: "" },
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    toggleSidebar(state) {
      state.sideBar = !state.sideBar;
    },
    toggleToast(state, action) {
      state.toast.display = action.payload.display;
      state.toast.type = action.payload.type;
      state.toast.msg = action.payload.msg;
    },
  },
});

export const { toggleSidebar, toggleToast } = uiSlice.actions;

export default uiSlice.reducer;
