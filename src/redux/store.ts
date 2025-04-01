/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import { combineReducers } from "@reduxjs/toolkit";
import documentReducer from "./slices/documentSlice";
import userReducer from "./slices/userSlice";

// Import the proper storage for browser environments
import storageLocal from "redux-persist/lib/storage";
import { baseApi } from "./api/baseApi";

// Create a no-op storage for server-side rendering
const createNoopStorage = () => {
  return {
    getItem(_key: string) {
      return Promise.resolve(null);
    },
    setItem(_key: string, value: any) {
      return Promise.resolve(value);
    },
    removeItem(_key: string) {
      return Promise.resolve();
    },
  };
};

const storage =
  typeof window !== "undefined" ? storageLocal : createNoopStorage();

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["documents", "user"],
};

const rootReducer = combineReducers({
  documents: documentReducer,
  user: userReducer,
  [baseApi.reducerPath]: baseApi.reducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    })      .concat(baseApi.middleware)
    ,
});
// Only create the persistor on the client side
export const persistor =
  typeof window !== "undefined" ? persistStore(store) : null;

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
