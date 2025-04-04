import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./fectures/auth/authSlice";
import emailReducer from "./fectures/email/emailSlice";
import filterReducer from "./fectures/auth/filterSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    email: emailReducer,
    filter: filterReducer,
  },
});
