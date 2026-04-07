import React from 'react';
import { Table, Tag, Button, Card, Typography, Space, Tooltip } from 'antd';
import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
import { useEmployeeRequests, useReviewRequest } from './employeesHooks';

const { Title } = Typography;

const EmployeeRequestsList = () => {
    const { data: requests, isLoading } = useEmployeeRequests();
    const updateRequestMutation = useReviewRequest();

    const handleAction = async (id, status) => {
        try {
            await updateRequestMutation.mutateAsync({ id, status });
        } catch (error) {
            console.error('Failed to update request:', error);
        }
    };

    const columns = [
        {
            title: 'الموظف',
            dataIndex: ['employee', 'username'],
            key: 'employee',
        },
        {
            title: 'نوع الطلب',
            dataIndex: 'request_type',
            key: 'request_type',
            render: (type) => {
                const types = {
                    leave: 'إجازة',
                    expense: 'طلب عهدة',
                    loan: 'سلفة',
                    other: 'أخرى'
                };
                return <Tag color="blue">{types[type] || type}</Tag>;
            }
        },
        {
            title: 'العنوان',
            dataIndex: 'title',
            key: 'title',
        },
        {
            title: 'الوصف',
            dataIndex: 'description',
            key: 'description',
            ellipsis: true,
        },
        {
            title: 'الحالة',
            dataIndex: 'status',
            key: 'status',
            render: (status) => {
                const statuses = {
                    pending: { color: 'orange', label: 'قيد المراجعة' },
                    approved: { color: 'green', label: 'مقبول' },
                    rejected: { color: 'red', label: 'مرفوض' }
                };
                const config = statuses[status] || { color: 'default', label: status };
                return <Tag color={config.color}>{config.label}</Tag>;
            }
        },
        {
            title: 'التاريخ',
            dataIndex: 'created_at',
            key: 'created_at',
            render: (date) => new Date(date).toLocaleDateString(),
        },
        {
            title: 'إجراءات',
            key: 'actions',
            render: (_, record) => (
                record.status === 'pending' && (
                    <Space>
                        <Tooltip title="الموافقة على الطلب">
                            <Button 
                                type="primary" 
                                shape="circle" 
                                icon={<CheckOutlined />} 
                                size="small"
                                onClick={() => handleAction(record.id, 'approved')}
                            />
                        </Tooltip>
                        <Tooltip title="رفض الطلب">
                            <Button 
                                type="primary" 
                                danger 
                                shape="circle" 
                                icon={<CloseOutlined />} 
                                size="small"
                                onClick={() => handleAction(record.id, 'rejected')}
                            />
                        </Tooltip>
                    </Space>
                )
            ),
        },
    ];

    return (
        <Card>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                <Title level={3}>طلبات وشكاوى الموظفين</Title>
            </div>
            
            <Table 
                columns={columns} 
                dataSource={requests} 
                rowKey="id" 
                loading={isLoading}
                pagination={{ pageSize: 10 }}
            />
        </Card>
    );
};

export default EmployeeRequestsList;
