import { useState, useEffect } from 'react';
import { message } from 'antd';
import googleApi from '../api/googleApi';

const useGoogleCalendar = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [loading, setLoading] = useState(false);

  // Kiểm tra trạng thái kết nối khi component mount
  useEffect(() => {
    checkConnection();
  }, []);

  const checkConnection = async () => {
    try {
      const connected = await googleApi.checkGoogleAuth();
      setIsConnected(connected);
    } catch (error) {
      setIsConnected(false);
    }
  };

  const connectGoogleCalendar = async () => {
    try {
      setLoading(true);
      const response = await googleApi.getGoogleAuthUrl();
      
      // Mở popup để đăng nhập Google
      const popup = window.open(
        response.url,
        'googleAuth',
        'width=500,height=600,scrollbars=yes,resizable=yes'
      );

      // Lắng nghe sự kiện khi popup đóng
      const checkClosed = setInterval(() => {
        if (popup.closed) {
          clearInterval(checkClosed);
          setLoading(false);
          // Kiểm tra lại trạng thái kết nối
          setTimeout(() => {
            checkConnection();
          }, 1000);
          message.success('Kết nối Google Calendar thành công!');
        }
      }, 1000);

    } catch (error) {
      setLoading(false);
      message.error('Lỗi khi kết nối Google Calendar: ' + error.message);
    }
  };

  const addEventToCalendar = async (documentId) => {
    if (!documentId) {
      message.error('Không tìm thấy ID tài liệu');
      return false;
    }

    try {
      setLoading(true);
      const response = await googleApi.addCalendarEvent(documentId);
      
      message.success('Đã thêm sự kiện vào Google Calendar thành công!');
      return true;
      
    } catch (error) {
      if (error.response?.status === 400) {
        message.error('Bạn chưa kết nối Google Calendar. Vui lòng kết nối trước!');
      } else {
        message.error('Lỗi khi thêm sự kiện: ' + error.message);
      }
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    isConnected,
    loading,
    connectGoogleCalendar,
    addEventToCalendar,
    checkConnection,
  };
};

export default useGoogleCalendar;
