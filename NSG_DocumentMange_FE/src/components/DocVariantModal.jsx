import { useEffect } from "react";
import { Modal, Input, Form, message } from "antd";

// eslint-disable-next-line react/prop-types
const DocVariantModal = ({ visible, onClose, onSave, editingVariant, loading ,okText, cancelText,}) => {
    const [form] = Form.useForm();

    useEffect(() => {
        if (editingVariant) {
            // eslint-disable-next-line react/prop-types
            form.setFieldsValue({ docVariantName: editingVariant.docVariantName });
        } else {
            form.resetFields();
        }
    }, [editingVariant, visible, form]);

    const handleSave = async () => {
        try {
            const values = await form.validateFields();
            await onSave(values.docVariantName);
            form.resetFields();
        // eslint-disable-next-line no-unused-vars
        } catch (error) {
            message.error("Vui lòng nhập loại văn bản hợp lệ");
        }
    };

    return (
        <Modal
            title={editingVariant ? "Sửa loại văn bản" : "Thêm loại văn bản"}
            open={visible}
            onCancel={onClose}
            onOk={handleSave}
            okText={okText} // Sử dụng okText từ props
      cancelText={cancelText}
            okButtonProps={{ loading }}
            cancelButtonProps={{ disabled: loading }}
        >
            <Form form={form} layout="vertical">
                <Form.Item
                    label="Tên loại văn bản"
                    name="docVariantName"
                    rules={[{ required: true, message: "Vui lòng nhập tên!" }]}
                >
                    <Input placeholder="Nhập tên loại văn bản..." disabled={loading} />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default DocVariantModal;