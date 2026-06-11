
import axiosInstance from './axiosInstance';


export const fetchDocumentStats = async ({ year, mode, userId, docType, docVariant }) => {
  try {
    const params = {};
    if (mode) params.mode = mode;
    if (year) params.year = year;
    if (userId) params.userId = userId;
    if (docType) params.docType = docType;
    if (docVariant) params.docVariant = docVariant;

    const response = await axiosInstance.get('/charts/stats', { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching document stats:', error);
    throw error.response?.data || { message: 'Something went wrong' };
  }
};

export const fetchDocumentsStatusStats = async ({ year, mode, userId, docVariant }) => {
  try {
    const response = await axiosInstance.get('/charts/status-stats', {
      params: {
        year: year || undefined,
        mode: mode || undefined,
        userId: userId || undefined,
        docVariant: docVariant || undefined,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching document stats:', error);
    throw error;
  }
};