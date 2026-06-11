import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice"; // Ensure this path is correct

const store = configureStore({
    reducer: {
        auth: authReducer, // Key should match the slice name
    },
});

export default store;
