import { useState, useEffect } from "react";
import { Input, Button, Collapse, message, Form } from "antd";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { getUserInfo, updateUserInfo } from "../../api/auth";
import GoogleAuthButton from "../../components/GoogleAuthButton";
import { Card } from "antd";
const { Panel } = Collapse;

const Member = () => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [userData, setUserData] = useState(null);
    const [userRole, setUserRole] = useState(null); // Store user role

    // Hàm lấy userId và role từ token
    const getUserInfoFromToken = () => {
        const token = Cookies.get("accessToken");
        if (!token) {
            message.error("Không tìm thấy token, vui lòng đăng nhập lại");
            return null;
        }

        try {
            const decodedToken = jwtDecode(token);
            const userId = decodedToken.userId || decodedToken.id || decodedToken.sub;
            const role = decodedToken.role || null; // Assuming role is included in the token
            return { userId, role };
        } catch (error) {
            message.error("Token không hợp lệ");
            console.error("Error decoding token:", error);
            return null;
        }
    };

    // Hàm lấy thông tin người dùng
    const fetchUserInfo = async (userId) => {
        if (!userId) return;

        try {
            setLoading(true);
            const response = await getUserInfo(userId);
            if (response.success) {
                setUserData(response.data);
                // Optionally, set role from API response if not in token
                setUserRole(response.data.role || userRole);
                form.setFieldsValue({
                    name: response.data.name,
                    email: response.data.email,
                    mobile: response.data.mobile,
                    positionName: response.data.position?.positionName || "Chưa xác định",
                    departmentName: response.data.department?.departmentName || "Chưa xác định",
                    password: "",
                    confirmPassword: "",
                });
            } else {
                message.error(response.message || "Không lấy được thông tin người dùng");
            }
        } catch (error) {
            message.error("Lỗi khi lấy thông tin người dùng");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    // Hàm cập nhật thông tin người dùng
    const handleUpdate = async (values) => {
        const { userId } = getUserInfoFromToken();
        if (!userId) return;

        try {
            setLoading(true);
            const updatedData = {
                name: values.name,
                email: values.email,
                mobile: values.mobile,
                password: values.password || undefined,
            };

            const response = await updateUserInfo(userId, updatedData);
            if (response.success) {
                message.success("Cập nhật thông tin thành công!");
                fetchUserInfo(userId);
            } else {
                message.error(response.message || "Cập nhật thông tin thất bại");
            }
        } catch (error) {
            message.error(error || "Lỗi khi cập nhật thông tin");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    // Lấy thông tin khi component mount
    useEffect(() => {
        const userInfo = getUserInfoFromToken();
        if (userInfo) {
            setUserRole(userInfo.role); // Set role from token
            fetchUserInfo(userInfo.userId);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Reset form khi nhấn Hủy
    const handleCancel = () => {
        form.resetFields();
        const { userId } = getUserInfoFromToken();
        if (userId) {
            fetchUserInfo(userId);
        }
    };

    // Check if user is allowed to edit
    const canEdit = ["admin", "manager"].includes(userRole);

    return (
        <div className="h-screen bg-gray-100 flex justify-center items-center p-6">
            <div className="bg-white rounded-lg shadow-md w-full h-full p-8 overflow-y-auto">
                <h2 className="text-2xl font-semibold text-gray-800 mb-6">
                    Quản lý thông tin cá nhân
                </h2>

                <Form form={form} layout="vertical" onFinish={handleUpdate}>
                    <div className="flex flex-wrap">
                        <div className="flex-1">
                            <Collapse defaultActiveKey={["1"]} className="mb-6">
                                <Panel header="Thông tin tài khoản" key="1">
                                    <div className="grid grid-cols-2 gap-4">
                                        <Form.Item
                                            label="Tên hiển thị"
                                            name="name"
                                            rules={[{ required: true, message: "Vui lòng nhập tên!" }]}
                                        >
                                            <Input placeholder="Nhập tên hiển thị" disabled={loading || !canEdit} />
                                        </Form.Item>

                                        <Form.Item
                                            label="Tài khoản (Email)"
                                            name="email"
                                            rules={[
                                                { required: true, message: "Vui lòng nhập email!" },
                                                { type: "email", message: "Email không hợp lệ!" },
                                            ]}
                                        >
                                            <Input placeholder="Nhập email" disabled={loading || !canEdit} />
                                        </Form.Item>

                                        <Form.Item
                                            label="Chức vụ/Vị trí công tác"
                                            name="positionName"
                                        >
                                            <Input disabled value={userData?.position?.positionName || "Chưa xác định"} />
                                        </Form.Item>

                                        <Form.Item
                                            label="Số điện thoại"
                                            name="mobile"
                                            rules={[
                                                { required: true, message: "Vui lòng nhập số điện thoại!" },
                                                { pattern: /^[0-9]{10}$/, message: "Số điện thoại phải có 10 chữ số!" },
                                            ]}
                                        >
                                            <Input placeholder="Nhập số điện thoại" disabled={loading} />
                                        </Form.Item>

                                        <Form.Item
                                            label="Phòng ban"
                                            name="departmentName"
                                        >
                                            <Input disabled value={userData?.department?.departmentName || "Chưa xác định"} />
                                        </Form.Item>

                                        <Form.Item
                                            label="Mật khẩu"
                                            name="password"
                                            rules={[
                                                { min: 6, message: "Mật khẩu phải có ít nhất 6 ký tự!" },
                                            ]}
                                        >
                                            <Input.Password placeholder="Nhập mật khẩu mới" disabled={loading} />
                                        </Form.Item>

                                        <Form.Item
                                            label="Nhập lại mật khẩu"
                                            name="confirmPassword"
                                            dependencies={["password"]}
                                            rules={[
                                                ({ getFieldValue }) => ({
                                                    validator(_, value) {
                                                        if (!value || getFieldValue("password") === value) {
                                                            return Promise.resolve();
                                                        }
                                                        return Promise.reject(new Error("Mật khẩu không khớp!"));
                                                    },
                                                }),
                                            ]}
                                        >
                                            <Input.Password placeholder="Nhập lại mật khẩu" disabled={loading} />
                                        </Form.Item>
                                    </div>
                                </Panel>
                            </Collapse>

                            {/* Google Authentication Section */}
                            <div className="mb-6">
                                <Card title="Kết nối Google Calendar" className="shadow-sm">
                                    <div className="text-center">
                                        <p className="text-gray-600 mb-4">
                                            Kết nối với Google Calendar để đồng bộ lịch làm việc
                                        </p>
                                        <GoogleAuthButton />
                                    </div>
                                </Card>
                            </div>


                                <div className="flex justify-end gap-4">
                                    <Button
                                        type="primary"
                                        htmlType="submit"
                                        className="bg-blue-500"
                                        size="large"
                                        loading={loading}
                                    >
                                        Lưu
                                    </Button>
                                    <Button
                                        danger
                                        size="large"
                                        onClick={handleCancel}
                                        disabled={loading}
                                    >
                                        Hủy
                                    </Button>
                                </div>
                      
                        </div>
                    </div>
                </Form>

            </div>
        </div>
    );
};

export default Member;