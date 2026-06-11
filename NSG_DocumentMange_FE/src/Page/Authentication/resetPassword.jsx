import { useState } from 'react';
import { Form, Input, Button, notification, Divider } from 'antd';
import { useNavigate } from 'react-router-dom';
import { requestResetPassword, verifyCode, resetPassword } from '../../api/auth';
import Header from './Header';
import LOGONSG from "../../assets/LOGONSG.png";

const ResetPassword = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Gửi yêu cầu reset mật khẩu
  const handleEmailSubmit = async () => {
    setLoading(true);
    try {
      await requestResetPassword(email);
      notification.success({
        message: 'Kiểm tra email của bạn',
        description: 'Chúng tôi đã gửi mã xác minh đến email của bạn.',
      });
      setStep(2);
    } catch (error) {
      notification.error({
        message: 'Lỗi khi gửi yêu cầu, Email không tồn tại, vui lòng thử lại!',
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  // Xác nhận mã xác minh
  const handleVerificationSubmit = async () => {
    setLoading(true);
    try {
      await verifyCode(email, verificationCode);
      notification.success({
        message: 'Xác minh thành công',
        description: 'Bạn có thể đặt lại mật khẩu của mình.',
      });
      setStep(3);
    } catch (error) {
      notification.error({
        message: 'Mã xác minh không hợp lệ, vui lòng thử lại!',
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  // Đặt mật khẩu mới
  const handlePasswordReset = async () => {
    setLoading(true);
    try {
      await resetPassword(email, newPassword);
      notification.success({
        message: 'Mật khẩu đã được cập nhật',
        description: 'Mật khẩu của bạn đã được đặt lại thành công.',
      });
      navigate('/login');
    } catch (error) {
      notification.error({
        message: 'Lỗi khi đặt lại mật khẩu, vui lòng thử lại!',
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col bg-white rounded-lg shadow-2xl p-16 w-full max-w-3xl">
          <div className="flex justify-center mb-6">
            <img
              src={LOGONSG}
              alt="Login Illustration"
              className="h-16 object-contain"
            />
          </div>
          <h2 className="text-center text-2xl font-semibold text-gray-800 mb-4">Đặt lại mật khẩu</h2>
          <Divider />
          <Form layout="vertical" onFinish={step === 1 ? handleEmailSubmit : step === 2 ? handleVerificationSubmit : handlePasswordReset}>
            {step === 1 && (
              <>
                <Form.Item label="Vui lòng nhập Email" name="email" required>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Nhập email của bạn"
                    size="large"
                    className="rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500"
                  />
                </Form.Item>
                <Button type="primary" htmlType="submit" loading={loading} size="large" block className="rounded-lg bg-blue-500 text-white hover:bg-blue-600">
                  Gửi mã xác minh
                </Button>
              </>
            )}

            {step === 2 && (
              <>
                <Form.Item label="Nhập mã xác minh" name="code" required>
                  <Input
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                    placeholder="Nhập mã xác minh"
                    size="large"
                    className="rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500"
                  />
                </Form.Item>
                <Button type="primary" htmlType="submit" loading={loading} size="large" block className="rounded-lg bg-blue-500 text-white hover:bg-blue-600">
                  Xác minh mã
                </Button>
              </>
            )}

            {step === 3 && (
              <>
                <Form.Item label="Mật khẩu mới" name="newPassword" required>
                  <Input.Password
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Nhập mật khẩu mới"
                    size="large"
                    className="rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500"
                    minLength={6}
                  />
                </Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                  size="large"
                  block
                  className="rounded-lg bg-blue-500 text-white hover:bg-blue-600"
                  disabled={newPassword.length < 6}
                >
                  Đặt lại mật khẩu
                </Button>
              </>
            )}
          </Form>
        </div>
      </div>
    </>
  );
};

export default ResetPassword;
