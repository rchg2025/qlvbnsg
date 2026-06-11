import axiosInstance from './axiosInstance.js';



 export const createUnit = async (unitData) => {
    try {
      const response = await axiosInstance.post('/units/create', unitData); 
      return response.data;
    } catch (error) {
      console.error("Error creating unit:", error.response?.data || error.message);
      throw error.response?.data || new Error("Failed to create unit"); 
    }
  };
  export const getAllUnits = async () => {
    try {
      const response = await axiosInstance.get('/units/getAll'); 
      return response.data.Units || []; 
    } catch (error) {
      console.error("Error fetching units:", error.response?.data || error.message);
      throw error.response?.data || new Error("Failed to fetch units");
    }
  };
  export const updateUnit = async (unitUpdateData) => {
    try {
    
      const response = await axiosInstance.put('/units/update', unitUpdateData);
      return response.data;
    } catch (error) {
      console.error("Error updating unit:", error.response?.data || error.message);
      throw error.response?.data || new Error("Failed to update unit");
    }
  };
  export const deleteUnit = async (unitID) => {
    try {
      
      const response = await axiosInstance.delete('/units/delete', {
        data: { unitID: unitID } 
      });
      return response.data;
    } catch (error) {
      console.error("Error deleting unit:", error.response?.data || error.message);
      throw error.response?.data || new Error("Failed to delete unit");
    }
  };