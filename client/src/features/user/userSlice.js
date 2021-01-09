import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import cookie from "js-cookie";
import jwt from "jsonwebtoken";

const initialState = {
  username: null,
  email: "",
  errorMsg: "",
  successMsg: "",
  thumbnail: "",
  cart: null,
  isLoggedIn: false,
};

export const fetchUser = createAsyncThunk(
  "user/fetchUser",
  async (userData, { rejectWithValue }) => {
    try {
      const res = await axios.get("/auth/user");
      return res.data;
    } catch (err) {
      console.log(err.response);
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
      cookie.remove("usersession");
      return rejectWithValue(err.response.data);
    }
  }
);

export const addToCart = createAsyncThunk(
  "user/addToCart",
  async ({ id, amount }, { rejectWithValue }) => {
    try {
      const token = cookie.get("usersession");
      jwt.verify(token, process.env.REACT_APP_JWT_SECRET);
      const res = await axios.post(
        "/api/purchase",
        { id, amount },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return res.data;
    } catch (err) {
      console.log(err);
      if (
        err.message === "jwt must be provided" ||
        err.message === "jwt expired"
      ) {
        let cart = cookie.getJSON("cart");
        if (cart) {
          const index = cart.findIndex((e) => e.id === id);
          if (index === -1) {
            cart.push({ id, amount });
            cookie.set("cart", JSON.stringify(cart), { expires: 15 });
            return cart;
          } else {
            cart[index].amount += amount;
            cookie.set("cart", JSON.stringify(cart), { expires: 15 });
            return cart;
          }
        } else {
          cart = [{ id, amount }];
          cookie.set("cart", JSON.stringify(cart), { expires: 15 });
          return cart;
        }
      }
      console.log("Error when add to cart", err.response.data);
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
      state.cart = action.payload.shoppingCart || [];
      state.isLoggedIn = action.payload.username ? true : false;
    },
    [fetchUser.rejected]: (state, action) => {
      state.username = null;
      state.email = "";
      state.thumbnail = "";
      state.errorMsg = action.payload;
    },
    [addToCart.fulfilled]: (state, action) => {
      state.cart = action.payload;
    },
  },
});

export const { clearStatus } = userSlice.actions;

export default userSlice.reducer;
