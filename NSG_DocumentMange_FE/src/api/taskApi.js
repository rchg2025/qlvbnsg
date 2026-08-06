import axiosInstance from './axiosInstance';

export const getTasks = async (userId) => {
    try {
        const response = await axiosInstance.get(`/tasks${userId ? `?userId=${userId}` : ''}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching tasks', error);
        throw error;
    }
};

export const createTask = async (taskData) => {
    try {
        const isFormData = taskData instanceof FormData;
        const response = await axiosInstance.post(`/tasks`, taskData, {
            headers: isFormData ? { "Content-Type": "multipart/form-data" } : {},
        });
        return response.data;
    } catch (error) {
        console.error('Error creating task', error);
        throw error;
    }
};

export const updateTask = async (taskId, updates) => {
    try {
        const isFormData = updates instanceof FormData;
        const response = await axiosInstance.put(`/tasks/${taskId}`, updates, {
            headers: isFormData ? { "Content-Type": "multipart/form-data" } : {},
        });
        return response.data;
    } catch (error) {
        console.error('Error updating task', error);
        throw error;
    }
};

export const deleteTask = async (taskId) => {
    try {
        const response = await axiosInstance.delete(`/tasks/${taskId}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting task', error);
        throw error;
    }
};
