/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from "react";
import { Navigate } from "react-router-dom";
import Cookies from "js-cookie"; // Import js-cookie để làm việc với cookies

const PrivateRoute = ({ children }) => {
  // Lấy token từ cookie
  const accessToken = Cookies.get("accessToken");

  // Kiểm tra xem token có tồn tại không
  if (accessToken) {
    return children; // Nếu có token, cho phép truy cập vào route
  }

  return <Navigate to="/login" replace />; // Nếu không có token, chuyển hướng đến trang login
};

export default PrivateRoute;
