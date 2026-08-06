import re

with open('src/Page/Schedule/SchedulePage.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. handleSelectEvent
content = content.replace(
    'assignees: task.assignees.map(a => a._id),\n            collaborators: (task.collaborators || []).map(a => a._id || a),\n            status: task.status',
    'assignees: task.assignees.map(a => a._id),\n            collaborators: (task.collaborators || []).map(a => a._id || a),\n            status: task.status,\n            priority: task.priority || \'NORMAL\''
)

# 2. handleOk
content = content.replace(
    'formData.append("status", values.status || \'TODO\');',
    'formData.append("status", values.status || \'TODO\');\n            formData.append("priority", values.priority || \'NORMAL\');'
)

# 3. tableColumns priority column & action stopPropagation
new_priority_column = '''        { 
            title: 'M?c d?', 
            dataIndex: 'priority', 
            key: 'priority', 
            render: priority => {
                const color = priority === 'FLASH' ? 'red' : priority === 'URGENT' ? 'orange' : 'blue';
                const label = priority === 'FLASH' ? 'H?a t?c' : priority === 'URGENT' ? 'Kh?n' : 'Bình thu?ng';
                return <Tag color={color}>{label}</Tag>;
            }
        },
        { 
            title: 'Tr?ng thái','''
content = content.replace("{ \n            title: 'Tr?ng thái',", new_priority_column)

# 3.b stopPropagation in actions
action_code = '''        {
            title: 'Thao tác',
            key: 'action',
            render: (_, record) => (
                <Space size="small" onClick={(e) => e.stopPropagation()}>
                    <Tooltip title="Xem chi ti?t">
                        <Button type="text" icon={<EyeOutlined />} onClick={(e) => { e.stopPropagation(); handleViewDetails(record); }} className="text-blue-500" />
                    </Tooltip>
                    <Tooltip title="C?p nh?t">
                        <Button type="text" icon={<EditOutlined />} onClick={(e) => { e.stopPropagation(); handleSelectEvent({ resource: record }); }} className="text-orange-500" />
                    </Tooltip>
                    <Tooltip title="L?ch s?">
                        <Button type="text" icon={<HistoryOutlined />} onClick={(e) => { e.stopPropagation(); handleViewHistory(record); }} className="text-gray-500" />
                    </Tooltip>
                </Space>
            )
        }'''
content = re.sub(r'\{\s*title:\s*\'Thao tác\',\s*key:\s*\'action\',\s*render:\s*\(_,\s*record\)\s*=>\s*\([\s\S]*?\}\s*\];', action_code + '\n    ];', content)

# 4. Table onRow
content = content.replace(
    'rowKey="_id"\n                pagination={{ pageSize: 20 }}\n                className="mt-4 shadow-sm border border-gray-100"',
    'rowKey="_id"\n                pagination={{ pageSize: 20 }}\n                className="mt-4 shadow-sm border border-gray-100"\n                onRow={(record) => ({\n                    onClick: () => handleViewDetails(record),\n                    style: { cursor: \'pointer\' }\n                })}'
)

# 5. renderKanbanBoard edit properties
kanban_edit = '''form.setFieldsValue({
                                                title: task.title,
                                                description: task.description,
                                                dates: [dayjs(task.startDate), dayjs(task.endDate)],
                                                assignees: task.assignees.map(u => u._id ? u._id : u),
                                                status: task.status,
                                                priority: task.priority || 'NORMAL'
                                            });'''
content = re.sub(r'form\.setFieldsValue\(\{[\s\S]*?status:\s*task\.status\s*\}\);', kanban_edit, content)

# 5.b Kanban Card UI
kanban_ui = '''<div className="font-medium text-gray-800 mb-1">
                                            {task.priority === 'FLASH' && <Tag color="red" className="mb-1">H?a t?c</Tag>}
                                            {task.priority === 'URGENT' && <Tag color="orange" className="mb-1">Kh?n</Tag>}
                                            {task.title}
                                        </div>'''
content = content.replace('<div className="font-medium text-gray-800 mb-1">{task.title}</div>', kanban_ui)

kanban_assignees = '''                                            <div className="flex flex-wrap gap-1 mt-2">
                                                {task.assignees.map(a => {
                                                    const assignedUser = users.find(u => u._id === (a._id || a));
                                                    return (
                                                        <span key={a._id || a} className="text-[10px] bg-gray-200 text-gray-700 px-1.5 py-0.5 rounded">
                                                            {assignedUser ? assignedUser.name : "User"}
                                                        </span>
                                                    )
                                                })}
                                                {task.collaborators && task.collaborators.map(c => {
                                                    const colUser = users.find(u => u._id === (c._id || c));
                                                    return (
                                                        <span key={'col'+(c._id || c)} className="text-[10px] bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded">
                                                            {colUser ? colUser.name : "User"}
                                                        </span>
                                                    )
                                                })}
                                            </div>'''
content = re.sub(r'<div className="flex flex-wrap gap-1 mt-2\">[\s\S]*?</div>', kanban_assignees, content, count=1)

# 6. Modal Form UI
form_ui = '''<Form form={form} layout="vertical">
                    <Row gutter={[16, 16]}>
                        <Col span={24}>
                            <Form.Item name="title" label="Tiêu d?" rules={[{ required: true, message: 'Vui lòng nh?p tiêu d?' }]}>
                                <Input />
                            </Form.Item>
                        </Col>
                        <Col span={24}>
                            <Form.Item name="description" label="N?i dung">
                                <Input.TextArea rows={3} />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name="dates" label="Th?i gian" rules={[{ required: true, message: 'Vui lòng ch?n th?i gian' }]}>
                                <RangePicker showTime format="DD/MM/YYYY HH:mm" className="w-full" />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name="priority" label="M?c d? công vi?c" initialValue="NORMAL">
                                <Select>
                                    <Option value="NORMAL">Bình thu?ng</Option>
                                    <Option value="URGENT">Kh?n</Option>
                                    <Option value="FLASH">H?a t?c</Option>
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name="assignees" label="Ngu?i th?c hi?n">
                                <Select mode="multiple" placeholder="Ch?n ngu?i th?c hi?n" showSearch optionFilterProp="children">
                                    {users.filter(u => u.role !== null).map(u => (
                                        <Option key={u._id} value={u._id}>{u.name} ({u.email})</Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name="collaborators" label="Ngu?i ph?i h?p">
                                <Select mode="multiple" placeholder="Ch?n ngu?i ph?i h?p" showSearch optionFilterProp="children">
                                    {users.filter(u => u.role !== null).map(u => (
                                        <Option key={u._id} value={u._id}>{u.name} ({u.email})</Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={24}>
                            <Form.Item label="T?p dính kèm">
                                <Upload
                                    multiple
                                    beforeUpload={() => false}
                                    fileList={fileList}
                                    onChange={(info) => {
                                        const newFileList = info.fileList.map(f => {
                                            if (f.originFileObj && !f.formattedName) {
                                                f.name = formatFileName(f.name);
                                                f.formattedName = true;
                                            }
                                            return f;
                                        });
                                        setFileList(newFileList);
                                    }}
                                >
                                    <Button icon={<UploadOutlined />}>T?i t?p lên</Button>
                                </Upload>
                            </Form.Item>
                        </Col>
                        {editingTask && (
                            <Col span={24}>
                                <Form.Item name="status" label="Tr?ng thái">
                                    <Select>
                                        <Option value="TODO">Chua làm</Option>
                                        <Option value="IN_PROGRESS">Ðang làm</Option>
                                        <Option value="DONE">Hoàn thành</Option>
                                    </Select>
                                </Form.Item>
                            </Col>
                        )}
                    </Row>
                </Form>'''
content = re.sub(r'<Form form={form} layout="vertical">[\s\S]*?<\/Form>', form_ui, content)

# 7. Add Priority to View Details Modal
details_priority = '''<div><strong className="text-gray-600">Tiêu d?:</strong> <span className="text-lg font-semibold">{selectedTask.title}</span></div>
                        <div>
                            <strong className="text-gray-600">M?c d?:</strong> 
                            <Tag className="ml-2" color={selectedTask.priority === 'FLASH' ? 'red' : selectedTask.priority === 'URGENT' ? 'orange' : 'blue'}>
                                {selectedTask.priority === 'FLASH' ? 'H?a t?c' : selectedTask.priority === 'URGENT' ? 'Kh?n' : 'Bình thu?ng'}
                            </Tag>
                        </div>'''
content = content.replace('<div><strong className="text-gray-600">Tiêu d?:</strong> <span className="text-lg font-semibold">{selectedTask.title}</span></div>', details_priority)


with open('src/Page/Schedule/SchedulePage.jsx', 'w', encoding='utf-8') as f:
    f.write(content)

print('Update successful')
