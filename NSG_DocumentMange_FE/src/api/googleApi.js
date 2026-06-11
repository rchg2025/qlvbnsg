import axiosInstance from "./axiosInstance";

// Google Calendar API functions
export const googleApi = {
  // 1. Lấy URL để đăng nhập Google
  getGoogleAuthUrl: async () => {
    try {
      const response = await axiosInstance.get("/google/auth");
      return response.data;
    } catch (error) {
      console.error("Error getting Google auth URL:", error);
      throw error;
    }
  },

  // 2. Thêm sự kiện vào Google Calendar
  addCalendarEvent: async (documentId) => {
    try {
      const response = await axiosInstance.post("/google/calendar", {
        documentId: documentId,
      });
      return response.data;
    } catch (error) {
      console.error("Error adding calendar event:", error);
      throw error;
    }
  },

  // 3. Kiểm tra trạng thái kết nối Google (nếu có implement)
  checkGoogleAuth: async () => {
    try {
      const response = await axiosInstance.get("/google/check");
      return response.data;
    } catch (error) {
      console.error("Error checking Google auth:", error);
      throw error;
    }
  },
};

export default googleApi;
