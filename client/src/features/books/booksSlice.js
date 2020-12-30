import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  status: "idle",
  searchedBooks: [],
  listBooks: [],
  numbers: 0,
  book: {},
  message: null,
};

export const fetchListBooks = createAsyncThunk(
  "books/fetchListBooks",

  async ({ genre, p, limit }, { rejectWithValue }) => {
    try {
      const res = await axios.get(
        `/api/books/genre/${genre}?limit=${limit}&p=${p}`
      );
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const fetchBook = createAsyncThunk(
  "books/fetchBook",
  async (id, { rejectWithValue }) => {
    try {
      const res = await axios.get(`/api/book/${id}`);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const searchBooks = createAsyncThunk("books/searchBooks", async (q) => {
  if (!q) {
    return { searchedBooks: [] };
  }
  const res = await axios.get(`/api/books/search/${q}`);
  return res.data;
});

export const queryBooks = createAsyncThunk(
  "books/queryBooks",
  async ({ q, p, limit }, { rejectWithValue }) => {
    try {
      const res = await axios.get(
        `/api/books/query/${q}?p=${p}&limit=${limit}`
      );
      return res.data;
    } catch (err) {
      console.log(err.response.data);
      return rejectWithValue(err.response.data);
    }
  }
);

const booksSlice = createSlice({
  name: "books",
  initialState,
  reducers: {},
  extraReducers: {
    // Fetch List Books
    [fetchListBooks.pending]: (state) => {
      state.status = "loading";
    },
    [fetchListBooks.fulfilled]: (state, action) => {
      state.message = null;
      state.status = "success";
      state.listBooks = action.payload.books;
      state.numbers = action.payload.numbers;
    },
    [fetchListBooks.rejected]: (state, action) => {
      state.message = action.payload.error;
      state.status = "failed";
    },
    // Fetch Book
    [fetchBook.pending]: (state) => {
      state.status = "loading";
    },
    [fetchBook.fulfilled]: (state, action) => {
      state.message = null;
      state.status = "success";
      state.book = action.payload;
    },
    [fetchBook.rejected]: (state, action) => {
      state.message = action.payload.error;
      state.status = "failed";
    },
    // Query Book
    [queryBooks.pending]: (state) => {
      state.status = "loading";
    },
    [queryBooks.fulfilled]: (state, action) => {
      state.message = null;
      state.status = "success";
      state.listBooks = action.payload.queriedBooks;
      state.numbers = action.payload.numbersQuery;
    },
    [queryBooks.rejected]: (state, action) => {
      state.message = action.payload.error;
      state.status = "failed";
    },

    // Search Book
    [searchBooks.fulfilled]: (state, action) => {
      state.searchedBooks = action.payload.searchedBooks;
    },
  },
});

export default booksSlice.reducer;
