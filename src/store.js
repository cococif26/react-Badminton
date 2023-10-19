import { configureStore } from "@reduxjs/toolkit";
import menuReducer from "./Reducers/menuSlice";

export const store = configureStore({
  reducer:{
    menu:menuReducer,
  }
});