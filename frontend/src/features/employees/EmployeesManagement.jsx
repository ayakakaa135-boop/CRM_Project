import React, { useState } from 'react';
import { Table, Tag, Button, Card, Typography, Avatar, Space, Modal, Form, Input, Select, Row, Col, Statistic, Switch, message, Popconfirm } from 'antd';
import { PlusOutlined, UserOutlined, EditOutlined, LockOutlined, SearchOutlined, StopOutlined, CheckCircleOutlined, DeleteOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { useStaff, useCreateStaff, useUpdateStaff, useResetStaffPassword, useDeleteStaff } from './employeesHooks';
import useAuthStore from '../../store/useAuthStore';

const { Title, Text } = Typography;
const { Option } = Select;
const { Search } = Input;

const EmployeesManagement = () => {
    const { t } = useTranslation();
    const currentUser = useAuthStore((state) => state.user);
    const { data: staff = [], isLoading } = useStaff();
    const createStaffMutation = useCreateStaff();
    const updateStaffMutation = useUpdateStaff();
    const resetPasswordMutation = useResetStaffPassword();
    const deleteStaffMutation = useDeleteStaff();
    const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
    const [editingStaff, setEditingStaff] = useState(null);
    const [passwordTarget, setPasswordTarget] = useState(null);
    const [searchText, setSearchText] = useState('');
    const [roleFilter, setRoleFilter] = useState('all');
    const [statusFilter, setStatusFilter] = useState('all');
    const [createForm] = Form.useForm();
    const [editForm] = Form.useForm();
    const [passwordForm] = Form.useForm();

    const stats = {
        total: staff.length,
        admins: staff.filter((item) => item.role === 'admin').length,
        managers: staff.filter((item) => item.role === 'manager').length,
        active: staff.filter((item) => item.is_active).length,
    };

    const filteredStaff = staff.filter((record) => {
        const query = searchText.trim().toLowerCase();
        const matchesText = !query || [
            record.username,
            record.first_name,
            record.last_name,
            record.email,
            record.phone,
        ].filter(Boolean).some((value) => value.toLowerCase().includes(query));
        const matchesRole = roleFilter === 'all' || record.role === roleFilter;
        const matchesStatus =
            statusFilter === 'all'
            || (statusFilter === 'active' && record.is_active)
            || (statusFilter === 'inactive' && !record.is_active);

        return matchesText && matchesRole && matchesStatus;
    });

    const columns = [
        {
            title: t('employeesPage.employee'),
            dataIndex: 'username',
            key: 'username',
            render: (text, record) => (
                <Space>
                    <Avatar src={record.avatar} icon={<UserOutlined />} />
                    <div>
                        <div style={{ fontWeight: 'bold' }}>{record.first_name} {record.last_name}</div>
                        <div style={{ fontSize: '12px', color: '#888' }}>@{text}</div>
                    </div>
                </Space>
            ),
        },
        {
            title: t('common.role'),
            dataIndex: 'role',
            key: 'role',
            render: (role) => {
                const roles = {
                    admin: { color: 'magenta', label: t('employeesPage.roleAdmin') },
                    manager: { color: 'gold', label: t('employeesPage.roleManager') },
                    employee: { color: 'cyan', label: t('employeesPage.roleEmployee') }
                };
                const config = roles[role] || { color: 'default', label: role };
                return <Tag color={config.color}>{config.label}</Tag>;
            }
        },
        {
            title: t('common.email'),
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: t('common.phone'),
            dataIndex: 'phone',
            key: 'phone',
        },
        {
            title: t('common.status'),
            dataIndex: 'is_active',
            key: 'is_active',
            render: (active) => (
                <Tag color={active ? 'green' : 'red'}>
                    {active ? t('common.active') : t('common.inactive')}
                </Tag>
            ),
        },
        {
            title: t('employeesPage.actions'),
            key: 'actions',
            render: (_, record) => (
                <Space>
                    <Button icon={<EditOutlined />} size="small" onClick={() => handleEdit(record)}>{t('common.edit')}</Button>
                    <Button icon={<LockOutlined />} size="small" danger onClick={() => handlePasswordReset(record)}>{t('employeesPage.password')}</Button>
                    <Button
                        icon={record.is_active ? <StopOutlined /> : <CheckCircleOutlined />}
                        size="small"
                        onClick={() => handleToggleStatus(record)}
                    >
                        {record.is_active ? t('employeesPage.toggleOff') : t('employeesPage.toggleOn')}
                    </Button>
                    <Popconfirm
                        title={t('employeesPage.deleteTitle')}
                        description={t('employeesPage.deleteDescription')}
                        onConfirm={() => handleDelete(record)}
                        okText={t('employeesPage.deleteConfirm')}
                        cancelText={t('common.cancel')}
                        disabled={record.id === currentUser?.id}
                    >
                        <Button
                            icon={<DeleteOutlined />}
                            size="small"
                            danger
                            disabled={record.id === currentUser?.id}
                        >
                            {t('common.delete')}
                        </Button>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    const handleCreate = async (values) => {
        try {
            await createStaffMutation.mutateAsync(values);
            message.success(t('employeesPage.createSuccess'));
            setIsCreateModalVisible(false);
            createForm.resetFields();
        } catch (error) {
            message.error(error.response?.data?.username?.[0] || t('employeesPage.createError'));
        }
    };

    const handleEdit = (record) => {
        setEditingStaff(record);
        editForm.setFieldsValue({
            username: record.username,
            first_name: record.first_name,
            last_name: record.last_name,
            email: record.email,
            phone: record.phone,
            role: record.role,
            is_active: record.is_active,
        });
    };

    const handleUpdate = async (values) => {
        try {
            await updateStaffMutation.mutateAsync({ id: editingStaff.id, ...values });
            message.success(t('employeesPage.updateSuccess'));
            setEditingStaff(null);
            editForm.resetFields();
        } catch (error) {
            message.error(error.response?.data?.detail || t('employeesPage.updateError'));
        }
    };

    const handlePasswordReset = (record) => {
        setPasswordTarget(record);
        passwordForm.resetFields();
    };

    const handleToggleStatus = async (record) => {
        if (record.id === currentUser?.id) {
            message.info(t('employeesPage.selfDisableError'));
            return;
        }

        try {
            await updateStaffMutation.mutateAsync({
                id: record.id,
                is_active: !record.is_active,
            });
            message.success(record.is_active ? t('employeesPage.disableSuccess') : t('employeesPage.enableSuccess'));
        } catch (error) {
            message.error(t('employeesPage.statusError'));
        }
    };

    const handleDelete = async (record) => {
        if (record.id === currentUser?.id) {
            message.info(t('employeesPage.selfDeleteError'));
            return;
        }

        try {
            await deleteStaffMutation.mutateAsync(record.id);
            message.success(t('employeesPage.deleteSuccess'));
        } catch (error) {
            message.error(error.response?.data?.detail || t('employeesPage.deleteError'));
        }
    };

    const handleSavePassword = async (values) => {
        try {
            await resetPasswordMutation.mutateAsync({
                id: passwordTarget.id,
                new_password: values.new_password,
                confirm_password: values.confirm_password,
            });
            message.success(t('employeesPage.passwordUpdated'));
            setPasswordTarget(null);
            passwordForm.resetFields();
        } catch (error) {
            const data = error.response?.data;
            const firstError = typeof data === 'object' ? Object.values(data)[0] : null;
            message.error(Array.isArray(firstError) ? firstError[0] : firstError || t('employeesPage.passwordError'));
        }
    };

    return (
        <Card>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                <div>
                    <Title level={3} style={{ marginBottom: 4 }}>{t('employeesPage.title')}</Title>
                    <Text type="secondary">{t('employeesPage.subtitle')}</Text>
                </div>
                <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsCreateModalVisible(true)}>
                    {t('employeesPage.add')}
                </Button>
            </div>

            <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
                <Col xs={24} sm={12} lg={6}>
                    <Card bordered={false} style={{ borderRadius: 14, background: '#f8fbff' }}>
                        <Statistic title={t('employeesPage.totalUsers')} value={stats.total} />
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card bordered={false} style={{ borderRadius: 14, background: '#fff9f0' }}>
                        <Statistic title={t('employeesPage.admins')} value={stats.admins} />
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card bordered={false} style={{ borderRadius: 14, background: '#f6ffed' }}>
                        <Statistic title={t('employeesPage.managers')} value={stats.managers} />
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card bordered={false} style={{ borderRadius: 14, background: '#f6fffb' }}>
                        <Statistic title={t('employeesPage.activeAccounts')} value={stats.active} />
                    </Card>
                </Col>
            </Row>

            <Row gutter={[12, 12]} style={{ marginBottom: 18 }}>
                <Col xs={24} md={12} lg={10}>
                    <Search
                        placeholder={t('employeesPage.searchPlaceholder')}
                        allowClear
                        enterButton={<SearchOutlined />}
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                    />
                </Col>
                <Col xs={12} md={6} lg={4}>
                    <Select value={roleFilter} onChange={setRoleFilter} style={{ width: '100%' }}>
                        <Option value="all">{t('common.all')}</Option>
                        <Option value="admin">{t('employeesPage.roleAdmin')}</Option>
                        <Option value="manager">{t('employeesPage.roleManager')}</Option>
                        <Option value="employee">{t('employeesPage.roleEmployee')}</Option>
                    </Select>
                </Col>
                <Col xs={12} md={6} lg={4}>
                    <Select value={statusFilter} onChange={setStatusFilter} style={{ width: '100%' }}>
                        <Option value="all">{t('common.allStatuses')}</Option>
                        <Option value="active">{t('common.active')}</Option>
                        <Option value="inactive">{t('common.inactive')}</Option>
                    </Select>
                </Col>
                <Col xs={24} lg={6} style={{ display: 'flex', alignItems: 'center' }}>
                    <Text type="secondary">{t('employeesPage.searchResults')}: {filteredStaff.length}</Text>
                </Col>
            </Row>
            
            <Table 
                columns={columns} 
                dataSource={filteredStaff} 
                rowKey="id" 
                loading={isLoading}
                pagination={{ pageSize: 10 }}
            />

            <Modal
                title={t('employeesPage.createModalTitle')}
                open={isCreateModalVisible}
                onCancel={() => setIsCreateModalVisible(false)}
                onOk={() => createForm.submit()}
                confirmLoading={createStaffMutation.isPending}
            >
                <Form form={createForm} layout="vertical" onFinish={handleCreate}>
                    <Form.Item name="username" label={t('employeesPage.username')} rules={[{ required: true }]}>
                        <Input placeholder="مثال: ahmed_ali" />
                    </Form.Item>
                    <Space size="middle" style={{ display: 'flex' }}>
                        <Form.Item name="first_name" label={t('employeesPage.firstName')} style={{ flex: 1 }}>
                            <Input />
                        </Form.Item>
                        <Form.Item name="last_name" label={t('employeesPage.lastName')} style={{ flex: 1 }}>
                            <Input />
                        </Form.Item>
                    </Space>
                    <Form.Item name="email" label={t('common.email')} rules={[{ type: 'email' }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="phone" label={t('common.phone')}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="role" label={t('common.role')} initialValue="employee">
                        <Select>
                            <Option value="admin">{t('employeesPage.roleAdmin')}</Option>
                            <Option value="manager">{t('employeesPage.roleManager')}</Option>
                            <Option value="employee">{t('employeesPage.roleEmployee')}</Option>
                        </Select>
                    </Form.Item>
                    <Form.Item name="password" label={t('common.password')} rules={[{ required: true }]}>
                        <Input.Password />
                    </Form.Item>
                </Form>
            </Modal>

            <Modal
                title={t('employeesPage.editModalTitle')}
                open={Boolean(editingStaff)}
                onCancel={() => setEditingStaff(null)}
                onOk={() => editForm.submit()}
                confirmLoading={updateStaffMutation.isPending}
            >
                <Form form={editForm} layout="vertical" onFinish={handleUpdate}>
                    <Form.Item name="username" label={t('employeesPage.username')} rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Space size="middle" style={{ display: 'flex' }}>
                        <Form.Item name="first_name" label={t('employeesPage.firstName')} style={{ flex: 1 }}>
                            <Input />
                        </Form.Item>
                        <Form.Item name="last_name" label={t('employeesPage.lastName')} style={{ flex: 1 }}>
                            <Input />
                        </Form.Item>
                    </Space>
                    <Form.Item name="email" label={t('common.email')} rules={[{ type: 'email' }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="phone" label={t('common.phone')}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="role" label={t('common.role')}>
                        <Select>
                            <Option value="admin">{t('employeesPage.roleAdmin')}</Option>
                            <Option value="manager">{t('employeesPage.roleManager')}</Option>
                            <Option value="employee">{t('employeesPage.roleEmployee')}</Option>
                        </Select>
                    </Form.Item>
                    <Form.Item name="is_active" label={t('common.status')} valuePropName="checked">
                        <Switch checkedChildren={t('common.active')} unCheckedChildren={t('common.inactive')} />
                    </Form.Item>
                </Form>
            </Modal>

            <Modal
                title={passwordTarget ? t('employeesPage.passwordModalTitle', { username: passwordTarget.username }) : t('employeesPage.defaultPasswordModalTitle')}
                open={Boolean(passwordTarget)}
                onCancel={() => setPasswordTarget(null)}
                onOk={() => passwordForm.submit()}
                confirmLoading={resetPasswordMutation.isPending}
            >
                <Form form={passwordForm} layout="vertical" onFinish={handleSavePassword}>
                    <Form.Item
                        name="new_password"
                        label={t('employeesPage.newPassword')}
                        rules={[{ required: true, message: t('employeesPage.newPasswordRequired') }]}
                    >
                        <Input.Password />
                    </Form.Item>
                    <Form.Item
                        name="confirm_password"
                        label={t('common.confirmPassword')}
                        dependencies={['new_password']}
                        rules={[
                            { required: true, message: t('employeesPage.confirmPasswordRequired') },
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    if (!value || getFieldValue('new_password') === value) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject(new Error(t('employeesPage.passwordMismatch')));
                                },
                            }),
                        ]}
                    >
                        <Input.Password />
                    </Form.Item>
                </Form>
            </Modal>
        </Card>
    );
};

export default EmployeesManagement;
