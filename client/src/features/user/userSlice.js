import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import cookie from "js-cookie";
import jwt from "jsonwebtoken";

const initialState = {
  username: null,
  errorMsg: "",
  successMsg: "",
  thumbnail: "",
};

export const fetchUser = createAsyncThunk(
  "user/fetchUser",
  async (userData, { rejectWithValue }) => {
    try {
      // const res = await axios.get("/auth/user");
      const token = cookie.get("usersession");
      const decoded = jwt.verify(token, process.env.REACT_APP_JWT_SECRET);
      return decoded;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const signup = createAsyncThunk(
  "user/signup",
  async (userData, { rejectWithValue }) => {
    try {
      const res = await axios.post("/auth/signup", userData);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const login = createAsyncThunk(
  "user",
  async (userData, { rejectWithValue }) => {
    try {
      const res = await axios.post("/auth/login", userData);
      const decoded = jwt.verify(res.data, process.env.REACT_APP_JWT_SECRET);
      return decoded;
    } catch (err) {
      cookie.remove("usersession");
      return rejectWithValue(err.response.data);
    }
  }
);

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    clearStatus(state) {
      state.errorMsg = "";
      state.successMsg = "";
    },
  },
  extraReducers: {
    [signup.fulfilled]: (state, action) => {
      state.successMsg = action.payload;
      state.errorMsg = "";
    },
    [signup.rejected]: (state, action) => {
      state.successMsg = "";
      state.errorMsg = action.payload;
    },
    [login.fulfilled]: (state, action) => {
      state.username = action.payload.username;
      state.errorMsg = "";
    },
    [login.rejected]: (state, action) => {
      state.username = null;
      state.errorMsg = action.payload;
    },
    [fetchUser.fulfilled]: (state, action) => {
      state.username = action.payload.username;
      state.thumbnail = action.payload.thumbnail || "";
    },
    [fetchUser.rejected]: (state) => {
      state.username = null;
    },
  },
});

export const { clearStatus } = userSlice.actions;

export default userSlice.reducer;
