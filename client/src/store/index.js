import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

import booksReducer from "../features/books/booksSlice";
import uiReducer from "../features/ui/uiSlice";
import userReducer from "../features/user/userSlice";

const userPersistConfig = {
  key: "user",
  storage,
  whitelist: ["isLoggedIn"],
};

export const store = configureStore({
  reducer: {
    books: booksReducer,
    ui: uiReducer,
    user: persistReducer(userPersistConfig, userReducer),
  },
});
export const persistor = persistStore(store);
