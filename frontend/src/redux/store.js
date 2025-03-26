import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../redux/fectures/auth/authSlice";
import filterReducer from "../redux/fectures/auth/filterSlice";
import emailReducer from "../redux/fectures/email/emailSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    email: emailReducer,
    filter: filterReducer,
  },
});
