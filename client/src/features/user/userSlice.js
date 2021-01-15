import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  username: null,
  email: "",
  errorMsg: "",
  successMsg: "",
  thumbnail: "",
  cart: [],
  isLoggedIn: false,
};

export const fetchUser = createAsyncThunk(
  "user/fetchUser",
  async (userData, { rejectWithValue }) => {
    try {
      const res = await axios.get("/auth/user");
      return res.data;
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
  "user/login",
  async (userData, { rejectWithValue }) => {
    try {
      const res = await axios.post("/auth/login", userData);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const addToCart = createAsyncThunk(
  "user/addToCart",
  async ({ id, amount }, { rejectWithValue }) => {
    try {
      const res = await axios.post("/api/purchase", { id, amount });
      return res.data;
    } catch (err) {
      console.log(err);
      console.log("Error when add to cart", err.response.data);
      return rejectWithValue(err.response.data);
    }
  }
);

export const updateCart = createAsyncThunk(
  "user/updateCart",
  async ({ id, amount }) => {
    try {
      const res = await axios.post("/api/updateCart", { id, amount });
      return res.data;
    } catch (err) {
      console.log("Error when update cart");
    }
  }
);

export const deleteCart = createAsyncThunk("user/deleteCart", async (id) => {
  try {
    const res = await axios.delete("/api/deleteCart", { data: { id } });
    return res.data;
  } catch (err) {
    console.log(err);
  }
});

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
      state.email = action.payload.email;
      state.thumbnail = action.payload.thumbnail || "";
      state.errorMsg = "";
      state.isLoggedIn = true;
    },
    [login.rejected]: (state, action) => {
      state.username = null;
      state.errorMsg = action.payload;
    },
    [fetchUser.fulfilled]: (state, action) => {
      state.username = action.payload.username || "";
      state.thumbnail = action.payload.thumbnail || "";
      state.email = action.payload.email || "";
      state.cart = action.payload.cart || [];
      state.isLoggedIn = action.payload.isLoggedIn;
    },
    [fetchUser.rejected]: (state, action) => {
      state.username = null;
      state.email = "";
      state.thumbnail = "";
      state.errorMsg = action.payload;
      state.isLoggedIn = false;
      state.cart = [];
    },
    [addToCart.fulfilled]: (state, action) => {
      state.cart = action.payload;
    },
    [updateCart.fulfilled]: (state, action) => {
      state.cart = action.payload;
    },
    [deleteCart.fulfilled]: (state, action) => {
      state.cart = action.payload;
    },
  },
});

export const { clearStatus } = userSlice.actions;

export default userSlice.reducer;
