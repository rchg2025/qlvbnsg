import axiosInstance from './axiosInstance.js';

// API gọi tạo Department
export const createDepartment = async (departmentData) => {
    try {
        const response = await axiosInstance.post("/departments/create", departmentData);
        return response.data;
    } catch (error) {
        console.error("lỗi tạo phòng ban", error);
        throw error;
    }
};
//Api gọi lấy thông tin của 1 Department
export const getUsersByDepartment = async (departmentId) => {
    try {
        const response = await axiosInstance.get(`/departments/${departmentId}`);
        return response.data;
    } catch (error) {
        console.error("Lỗi khi lấy danh sách user:", error);
        throw error;
    }
};
// API gọi lấy tất cả các Department
export const getAllDepartments = async () => {
    try {
        const response = await axiosInstance.get("/departments/getAll");
        return response.data;
    } catch (error) {
        console.error("lỗi lấy danh sách phòng ban", error);
        throw error;
    }
};

// API gọi xóa Department
export const deleteDepartment = async (departmentID) => {
    try {
        const response = await axiosInstance.post("/departments/delete", { departmentID });
        return response.data;
    } catch (error) {
        console.error("lỗi xóa phòng ban", error);
        throw error;
    }
};

// API gọi cập nhật Department
export const updateDepartment = async (departmentData) => {
    try {
        const response = await axiosInstance.post("/departments/update", departmentData);
        return response.data;
    } catch (error) {
        console.error("lỗi cập nhật phòng ban", error);
        throw error;
    }
};
