import { useState, useEffect } from 'react';
import { Button, message } from 'antd';
import { GoogleOutlined } from '@ant-design/icons';
import googleApi from '../api/googleApi';

const GoogleAuthButton = () => {
  const [loading, setLoading] = useState(false);
  const [googleConnected, setGoogleConnected] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  // Kiểm tra trạng thái Google Auth khi component mount
  useEffect(() => {
    const checkGoogleAuthStatus = async () => {
      try {
        console.log('Checking Google auth status...');
        const response = await googleApi.checkGoogleAuth();
        console.log('Google auth response:', response);
        
        // Kiểm tra response có đúng format không
        if (response && typeof response.googleConnected === 'boolean') {
          setGoogleConnected(response.googleConnected);
          console.log('Google connected:', response.googleConnected);
        } else {
          console.log('Invalid response format, defaulting to false');
          setGoogleConnected(false);
        }
      } catch (error) {
        console.error('Error checking Google auth status:', error);
        console.error('Error details:', error.response?.data || error.message);
        setGoogleConnected(false);
      } finally {
        setCheckingAuth(false);
      }
    };

    checkGoogleAuthStatus();
  }, []);

  const handleGoogleAuth = async () => {
    try {
      setLoading(true);
      const response = await googleApi.getGoogleAuthUrl();
      
      // Chuyển trang trực tiếp đến Google Auth
      window.location.href = response.url;

    } catch (error) {
      setLoading(false);
      message.error('Lỗi khi ủy quyền Google Calendar: ' + error.message);
    }
  };

  const handleRevokeAuth = async () => {
    try {
      setLoading(true);
      await googleApi.revokeGoogleAuth();
      setGoogleConnected(false);
      message.success('Đã hủy ủy quyền Google Calendar thành công!');
    } catch (error) {
      message.error('Lỗi khi hủy ủy quyền: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Debug: hiển thị trạng thái hiện tại
  console.log('Current state:', { checkingAuth, googleConnected });
  
  // Test: hardcode để kiểm tra logic
  // setGoogleConnected(true); // Uncomment để test ẩn nút

  // Nếu đang kiểm tra trạng thái auth, hiển thị loading
  if (checkingAuth) {
    return (
      <Button
        type="primary"
        icon={<GoogleOutlined />}
        loading={true}
      >
        Đang kiểm tra...
      </Button>
    );
  }

  // Nếu đã kết nối Google, hiển thị trạng thái "Đã ủy quyền"
  if (googleConnected) {
    console.log('Google connected - showing authorized status');
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'center' }}>
        <Button
          type="default"
          icon={<GoogleOutlined />}
          disabled
          className="border-green-500 text-green-500 bg-green-50"
        >
          Đã ủy quyền Google Calendar
        </Button>
        <Button
          danger
          onClick={handleRevokeAuth}
          loading={loading}
        >
          Hủy ủy quyền
        </Button>
      </div>
    );
  }

  // Nếu chưa kết nối Google, hiển thị nút ủy quyền
  console.log('Google not connected - showing button');
  return (
    <Button
      type="primary"
      icon={<GoogleOutlined />}
      onClick={handleGoogleAuth}
      loading={loading}
    >
      Ủy quyền Google Calendar
    </Button>
  );
};

export default GoogleAuthButton;