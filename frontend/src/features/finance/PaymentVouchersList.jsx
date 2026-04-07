import React, { useState } from 'react';
import { Table, Tag, Button, Card, Typography } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useQuery } from '@tanstack/react-query';
import apiClient, { unwrapListResponse } from '../../api/apiClient';
import VoucherModal from './VoucherModal';

const { Title, Text } = Typography;

const PaymentVouchersList = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { data: payments, isLoading } = useQuery({
        queryKey: ['payments'],
        queryFn: async () => {
            const { data } = await apiClient.get('/finance/payments/');
            return unwrapListResponse(data);
        }
    });

    const columns = [
        {
            title: 'رقم السند',
            dataIndex: 'id',
            key: 'id',
            render: (text) => `PV-${text}`,
        },
        {
            title: 'نوع السند',
            dataIndex: 'voucher_type',
            key: 'voucher_type',
            render: (type) => {
                const types = {
                    salary: 'راتب',
                    commission: 'عمولة',
                    expense: 'مصاريف تشغيلية',
                    other: 'أخرى'
                };
                return <Tag color={type === 'salary' ? 'green' : 'blue'}>{types[type] || type}</Tag>;
            }
        },
        {
            title: 'المستلم',
            dataIndex: ['employee', 'username'],
            key: 'employee',
            render: (text, record) => record.employee_name || text || 'جهات خارجية',
        },
        {
            title: 'المبلغ',
            dataIndex: 'amount',
            key: 'amount',
            render: (amount) => `${parseFloat(amount || 0).toLocaleString('ar-SA')} ريال`,
        },
        {
            title: 'التاريخ',
            dataIndex: 'date',
            key: 'date',
        },
        {
            title: 'طريقة الدفع',
            dataIndex: 'payment_method',
            key: 'payment_method',
            render: (method) => {
                const methods = {
                    cash: 'نقدي',
                    bank_transfer: 'تحويل بنكي',
                    cheque: 'شيك'
                };
                return <Tag color="cyan">{methods[method] || method}</Tag>;
            }
        },
    ];

    return (
        <Card>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                <div>
                    <Title level={3} style={{ marginBottom: 4 }}>سندات الصرف (المدفوعات)</Title>
                    <Text type="secondary">تسجيل الرواتب والعمولات والمصاريف التشغيلية ومتابعة مخرجات الصرف.</Text>
                </div>
                <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsModalOpen(true)}>
                    إنشاء سند صرف
                </Button>
            </div>
            
            <Table 
                columns={columns} 
                dataSource={payments || []} 
                rowKey="id" 
                loading={isLoading}
                pagination={{ pageSize: 10 }}
            />

            <VoucherModal
                open={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                mode="payment"
            />
        </Card>
    );
};

export default PaymentVouchersList;
