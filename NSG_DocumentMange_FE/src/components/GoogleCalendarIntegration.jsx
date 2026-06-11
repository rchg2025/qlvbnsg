import { useState } from 'react';
import { Button, message, Modal, Space } from 'antd';
import { CalendarOutlined, GoogleOutlined, CheckCircleOutlined } from '@ant-design/icons';
import googleApi from '../api/googleApi';

const GoogleCalendarIntegration = ({ documentId, documentInfo }) => {
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);

  // Hàm để kết nối Google Calendar
  const connectGoogleCalendar = async () => {
    try {
      setLoading(true);
      const response = await googleApi.getGoogleAuthUrl();
      
      // Mở cửa sổ popup để đăng nhập Google
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
          message.success('Kết nối Google Calendar thành công!');
        }
      }, 1000);

    } catch (error) {
      setLoading(false);
      message.error('Lỗi khi kết nối Google Calendar: ' + error.message);
    }
  };

  // Hàm để thêm sự kiện vào Calendar
  const addToCalendar = async () => {
    if (!documentId) {
      message.error('Không tìm thấy ID tài liệu');
      return;
    }

    try {
      setLoading(true);
      const response = await googleApi.addCalendarEvent(documentId);
      
      message.success('Đã thêm sự kiện vào Google Calendar thành công!');
      setIsModalVisible(false);
      
    } catch (error) {
      if (error.response?.status === 400) {
        message.error('Bạn chưa kết nối Google Calendar. Vui lòng kết nối trước!');
        setIsModalVisible(false);
      } else {
        message.error('Lỗi khi thêm sự kiện: ' + error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  // Hàm để kiểm tra trạng thái kết nối
  const checkConnection = async () => {
    try {
      const response = await googleApi.checkGoogleAuth();
      return response.isConnected;
    } catch {
      return false;
    }
  };

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <>
      <Space>
        <Button
          type="primary"
          icon={<GoogleOutlined />}
          onClick={connectGoogleCalendar}
          loading={loading}
        >
          Ủy quyền Google Calendar
        </Button>
        
        <Button
          icon={<CalendarOutlined />}
          onClick={showModal}
          disabled={loading}
        >
          Thêm vào Calendar
        </Button>
      </Space>

      <Modal
        title="Thêm sự kiện vào Google Calendar"
        open={isModalVisible}
        onOk={addToCalendar}
        onCancel={handleCancel}
        confirmLoading={loading}
        okText="Thêm sự kiện"
        cancelText="Hủy"
      >
        <div style={{ marginBottom: 16 }}>
          <p><strong>Tài liệu:</strong> {documentInfo?.docNum}/{documentInfo?.docCode}</p>
          <p><strong>Mô tả:</strong> {documentInfo?.shortDescription}</p>
          <p><strong>Ghi chú:</strong> {documentInfo?.note}</p>
          <p><strong>Ngày tạo:</strong> {documentInfo?.createdAt ? new Date(documentInfo.createdAt).toLocaleString('vi-VN') : 'N/A'}</p>
          <p><strong>Hạn xử lý:</strong> {documentInfo?.deadlineDay ? new Date(documentInfo.deadlineDay).toLocaleString('vi-VN') : 'N/A'}</p>
        </div>
        
        <div style={{ 
          padding: 12, 
          backgroundColor: '#f6ffed', 
          border: '1px solid #b7eb8f',
          borderRadius: 6,
          marginBottom: 16
        }}>
          <CheckCircleOutlined style={{ color: '#52c41a', marginRight: 8 }} />
          Sự kiện sẽ được thêm vào Google Calendar với nhắc nhở trước 1 ngày.
        </div>
      </Modal>
    </>
  );
};

export default GoogleCalendarIntegration;
