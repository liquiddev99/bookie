import { configureStore } from "@reduxjs/toolkit";

import booksReducer from "../features/books/booksSlice";
import uiReducer from "../features/ui/uiSlice";
import userReducer from "../features/user/userSlice";

export default configureStore({
  reducer: {
    books: booksReducer,
    ui: uiReducer,
    user: userReducer,
  },
});
