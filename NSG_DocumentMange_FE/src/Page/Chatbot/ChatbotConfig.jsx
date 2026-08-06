import React, { useEffect, useState } from 'react';
import { Form, Input, Button, Switch, Select, Row, Col, Typography, message, Card } from 'antd';
import { RobotOutlined, CopyOutlined, CheckOutlined } from '@ant-design/icons';
import axiosInstance from '../../api/axiosInstance';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;

const ChatbotConfig = () => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [configId, setConfigId] = useState(null);
    const [copied, setCopied] = useState(false);
    const [colorPreview, setColorPreview] = useState('#FDC700');

    useEffect(() => {
        fetchConfig();
    }, []);

    const fetchConfig = async () => {
        try {
            setLoading(true);
            const res = await axiosInstance.get('/chatbot-config');
            if (res.data.success && res.data.data) {
                form.setFieldsValue({
                    isActive: res.data.data.isActive,
                    geminiApiKey: res.data.data.geminiApiKey,
                    primaryColor: res.data.data.primaryColor,
                    position: res.data.data.position,
                    width: res.data.data.width,
                    height: res.data.data.height,
                });
                setColorPreview(res.data.data.primaryColor);
            }
        } catch (error) {
            console.error("Error fetching config:", error);
            message.error("Không thể tải cấu hình Chatbot.");
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (values) => {
        try {
            setLoading(true);
            const res = await axiosInstance.put('/chatbot-config', values);
            if (res.data.success) {
                message.success("Lưu cấu hình thành công!");
            }
        } catch (error) {
            console.error("Error saving config:", error);
            message.error("Lỗi khi lưu cấu hình.");
        } finally {
            setLoading(false);
        }
    };

    const embedCode = `<!-- AI Chatbot Widget -->
<script charset="utf-8" src="https://vanban.nsg.edu.vn/chatbot-widget.js?v=1705986195145"
  data-color="${colorPreview}"
  data-position="${form.getFieldValue('position') || 'left'}"
  data-title="Tư vấn trực tuyến"
  data-logo="">
</script>`;

    const handleCopy = () => {
        navigator.clipboard.writeText(embedCode);
        setCopied(true);
        setTimeout(() => setCopied(false), 3000);
    };

    return (
        <div className="p-6 bg-white rounded-lg shadow-sm w-full">
            <div className="flex items-center gap-2 mb-6">
                <RobotOutlined className="text-2xl text-blue-600" />
                <Title level={4} style={{ margin: 0 }}>Cấu hình AI Chatbot</Title>
            </div>

            <Form
                form={form}
                layout="vertical"
                onFinish={handleSave}
                initialValues={{
                    isActive: false,
                    position: 'left',
                    width: '350px',
                    height: '480px',
                    primaryColor: '#FDC700'
                }}
            >
                <Form.Item name="isActive" valuePropName="checked" label={<span className="font-semibold">Kích hoạt Chatbot AI</span>}>
                    <Switch />
                </Form.Item>

                <Form.Item
                    name="geminiApiKey"
                    label={<span className="font-medium text-gray-700">Gemini API Key</span>}
                    extra="Lấy tại Google AI Studio. Có thể để trống nếu đã cấu hình trong .env."
                >
                    <Input.Password placeholder="Nhập API Key của bạn..." />
                </Form.Item>

                <Row gutter={24}>
                    <Col span={12}>
                        <Form.Item
                            name="primaryColor"
                            label={<span className="font-medium text-gray-700">Màu sắc chủ đạo</span>}
                        >
                            <Input 
                                prefix={
                                    <input 
                                        type="color"
                                        value={colorPreview || '#FDC700'}
                                        onChange={(e) => {
                                            const newColor = e.target.value;
                                            setColorPreview(newColor);
                                            form.setFieldsValue({ primaryColor: newColor });
                                        }}
                                        className="w-6 h-6 rounded-sm cursor-pointer p-0 border-none mr-2"
                                        style={{ backgroundColor: 'transparent' }}
                                    />
                                }
                                onChange={(e) => {
                                    setColorPreview(e.target.value);
                                    form.setFieldsValue({ primaryColor: e.target.value });
                                }}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name="position"
                            label={<span className="font-medium text-gray-700">Vị trí hiển thị</span>}
                        >
                            <Select>
                                <Option value="left">Góc dưới bên trái</Option>
                                <Option value="right">Góc dưới bên phải</Option>
                            </Select>
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={24}>
                    <Col span={12}>
                        <Form.Item
                            name="width"
                            label={<span className="font-medium text-gray-700">Chiều rộng khung chat</span>}
                        >
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name="height"
                            label={<span className="font-medium text-gray-700">Chiều cao khung chat</span>}
                        >
                            <Input />
                        </Form.Item>
                    </Col>
                </Row>

                <div className="mt-8 flex justify-end">
                    <Button 
                        type="primary" 
                        htmlType="submit" 
                        loading={loading}
                        className="bg-emerald-600 hover:bg-emerald-700 border-none px-8"
                        icon={<CheckOutlined />}
                    >
                        Lưu cấu hình
                    </Button>
                </div>
            </Form>
        </div>
    );
};

export default ChatbotConfig;
