import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    login: {
      currentUser: null,
      accessToken: null,
      isFetching: false,
      error: false,
      errorMessage: "", // Lưu thông báo lỗi từ server
    },
  },
  reducers: {
    // Login actions
    loginStart: (state) => {
      state.login.isFetching = true;
      state.login.error = false;
      state.login.errorMessage = "";
    },
    loginSuccess: (state, action) => {
      state.login.isFetching = false;
      state.login.currentUser = action.payload.name; // Lấy tên từ payload
      state.login.accessToken = action.payload.accessToken; // Lấy token từ payload
      state.login.error = false;
    },
    loginFailed: (state, action) => {
      state.login.isFetching = false;
      state.login.error = true;
      state.login.errorMessage = action.payload; // Lưu thông báo lỗi từ action.payload
    },
  },
});

export const {
  loginStart,
  loginFailed,
  loginSuccess,
} = authSlice.actions;

export default authSlice.reducer;
