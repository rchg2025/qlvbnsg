import axiosInstance from './axiosInstance.js';


// Lấy tất cả các vị trí
export const getAllPositions = async () => {
  try {
    const response = await axiosInstance.get("/positions/getAll");
    return response.data;
  } catch (error) {
    throw new Error(error.message);
  }
};

// Tạo một vị trí mới
export const createPosition = async (positionData) => {
  try {
    const response = await axiosInstance.post("/positions/create", positionData);
    return response.data;
  } catch (error) {
    throw new Error(error.message);
  }
};

// Cập nhật vị trí
export const updatePosition = async (positionData) => {
  try {
    const response = await axiosInstance.post("/positions/update", positionData);
    return response.data;
  } catch (error) {
    throw new Error(error.message);
  }
};

// Xóa vị trí
export const deletePosition = async (positionID) => {
  try {
    const response = await axiosInstance.post("/positions/delete", { positionID });
    return response.data;
  } catch (error) {
    throw new Error(error.message);
  }
};
