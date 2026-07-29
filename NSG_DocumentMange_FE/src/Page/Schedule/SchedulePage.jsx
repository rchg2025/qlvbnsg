import React, { useState, useEffect } from 'react';
import { Calendar, Badge, Modal, Form, Input, DatePicker, Select, Button, message } from 'antd';
import dayjs from 'dayjs';
import { getTasks, createTask, updateTask, deleteTask } from '../../api/taskApi';
import { getAllUsers } from '../../api/auth';
import { useNotificationContext } from '../../context/NotificationContext';

const { Option } = Select;
const { RangePicker } = DatePicker;

const SchedulePage = () => {
    const { userId } = useNotificationContext();
    const [tasks, setTasks] = useState([]);
    const [users, setUsers] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedDate, setSelectedDate] = useState(dayjs());
    const [form] = Form.useForm();
    const [editingTask, setEditingTask] = useState(null);

    useEffect(() => {
        loadTasks();
        loadUsers();
    }, [userId]);

    const loadTasks = async () => {
        try {
            const res = await getTasks(userId);
            if (res.success) {
                setTasks(res.data);
            }
        } catch (error) {
            message.error("Lỗi khi tải danh sách công việc");
        }
    };

    const loadUsers = async () => {
        try {
            const res = await getAllUsers();
            if (res && res.users) {
                setUsers(res.users);
            }
        } catch (error) {
            console.error("Lỗi tải danh sách người dùng", error);
        }
    };

    const getListData = (value) => {
        const listData = tasks.filter(t => {
            const start = dayjs(t.startDate).startOf('day');
            const end = dayjs(t.endDate).endOf('day');
            const current = value.startOf('day');
            return current.isAfter(start.subtract(1, 'day')) && current.isBefore(end.add(1, 'day'));
        });
        return listData;
    };

    const dateCellRender = (value) => {
        const listData = getListData(value);
        return (
            <ul className="events p-0 m-0 list-none">
                {listData.map((item) => (
                    <li key={item._id} onClick={(e) => { e.stopPropagation(); openEditModal(item); }}>
                        <Badge 
                            status={item.status === 'DONE' ? 'success' : item.status === 'IN_PROGRESS' ? 'processing' : 'warning'} 
                            text={<span className="text-xs">{item.title}</span>} 
                        />
                    </li>
                ))}
            </ul>
        );
    };

    const onSelect = (date) => {
        setSelectedDate(date);
        form.resetFields();
        form.setFieldsValue({
            dates: [date, date]
        });
        setEditingTask(null);
        setIsModalVisible(true);
    };

    const openEditModal = (task) => {
        setEditingTask(task);
        form.setFieldsValue({
            title: task.title,
            description: task.description,
            dates: [dayjs(task.startDate), dayjs(task.endDate)],
            assignees: task.assignees.map(a => a._id),
            status: task.status
        });
        setIsModalVisible(true);
    };

    const handleOk = async () => {
        try {
            const values = await form.validateFields();
            const taskData = {
                title: values.title,
                description: values.description,
                startDate: values.dates[0].toDate(),
                endDate: values.dates[1].toDate(),
                assignees: values.assignees,
                status: values.status,
                createdBy: userId
            };

            if (editingTask) {
                await updateTask(editingTask._id, taskData);
                message.success("Cập nhật công việc thành công!");
            } else {
                await createTask(taskData);
                message.success("Thêm công việc thành công!");
            }
            setIsModalVisible(false);
            loadTasks();
        } catch (error) {
            console.error(error);
        }
    };

    const handleDelete = async () => {
        if (editingTask) {
            try {
                await deleteTask(editingTask._id);
                message.success("Đã xóa công việc!");
                setIsModalVisible(false);
                loadTasks();
            } catch (error) {
                message.error("Lỗi khi xóa");
            }
        }
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-gray-800">Lịch Công Tác</h2>
                <Button type="primary" onClick={() => onSelect(dayjs())}>
                    + Thêm công việc
                </Button>
            </div>
            
            <Calendar dateCellRender={dateCellRender} onSelect={onSelect} />

            <Modal
                title={editingTask ? "Cập nhật công việc" : "Thêm công việc mới"}
                open={isModalVisible}
                onOk={handleOk}
                onCancel={() => setIsModalVisible(false)}
                footer={[
                    editingTask && <Button key="delete" danger onClick={handleDelete}>Xóa</Button>,
                    <Button key="cancel" onClick={() => setIsModalVisible(false)}>Hủy</Button>,
                    <Button key="submit" type="primary" onClick={handleOk}>Lưu</Button>
                ]}
            >
                <Form form={form} layout="vertical">
                    <Form.Item name="title" label="Tiêu đề" rules={[{ required: true, message: 'Vui lòng nhập tiêu đề' }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="description" label="Nội dung">
                        <Input.TextArea rows={3} />
                    </Form.Item>
                    <Form.Item name="dates" label="Thời gian" rules={[{ required: true, message: 'Vui lòng chọn thời gian' }]}>
                        <RangePicker showTime format="DD/MM/YYYY HH:mm" />
                    </Form.Item>
                    <Form.Item name="assignees" label="Người thực hiện">
                        <Select mode="multiple" placeholder="Chọn người thực hiện">
                            {users.map(u => (
                                <Option key={u._id} value={u._id}>{u.name} ({u.email})</Option>
                            ))}
                        </Select>
                    </Form.Item>
                    {editingTask && (
                        <Form.Item name="status" label="Trạng thái">
                            <Select>
                                <Option value="TODO">Chưa làm</Option>
                                <Option value="IN_PROGRESS">Đang làm</Option>
                                <Option value="DONE">Hoàn thành</Option>
                            </Select>
                        </Form.Item>
                    )}
                </Form>
            </Modal>
        </div>
    );
};

export default SchedulePage;
