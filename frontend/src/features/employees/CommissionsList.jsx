import React from 'react';
import { Table, Tag, Card, Typography, Space } from 'antd';
import { useCommissions } from './employeesHooks';

const { Title } = Typography;

const CommissionsList = () => {
    const { data: commissions, isLoading } = useCommissions();

    const columns = [
        {
            title: 'الموظف',
            dataIndex: ['employee', 'username'],
            key: 'employee',
            render: (text, record) => record.employee_name || text || 'Unknown',
        },
        {
            title: 'الشركة',
            dataIndex: ['company', 'name'],
            key: 'company',
            render: (text, record) => record.company_name || text || '---',
        },
        {
            title: 'المبلغ',
            dataIndex: 'amount',
            key: 'amount',
            render: (amount) => `${parseFloat(amount).toLocaleString()} ريال`,
        },
        {
            title: 'التاريخ',
            dataIndex: 'date',
            key: 'date',
        },
        {
            title: 'الحالة',
            dataIndex: 'status',
            key: 'status',
            render: (status) => {
                const statuses = {
                    pending: { color: 'orange', label: 'قيد الانتظار' },
                    paid: { color: 'green', label: 'تم الصرف' },
                    cancelled: { color: 'red', label: 'ملغاة' }
                };
                const config = statuses[status] || { color: 'default', label: status };
                return <Tag color={config.color}>{config.label}</Tag>;
            }
        },
        {
            title: 'سند الصرف',
            dataIndex: 'payment_voucher',
            key: 'voucher',
            render: (voucher) => voucher ? `PV-${voucher}` : '---',
        },
    ];

    return (
        <Card>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                <Title level={3}>عمولات الموظفين</Title>
            </div>
            
            <Table 
                columns={columns} 
                dataSource={commissions} 
                rowKey="id" 
                loading={isLoading}
                pagination={{ pageSize: 10 }}
            />
        </Card>
    );
};

export default CommissionsList;
