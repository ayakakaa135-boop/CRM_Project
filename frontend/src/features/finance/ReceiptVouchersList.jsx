import React, { useState } from 'react';
import { Table, Tag, Button, Card, Typography } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useQuery } from '@tanstack/react-query';
import apiClient, { unwrapListResponse } from '../../api/apiClient';
import VoucherModal from './VoucherModal';

const { Title, Text } = Typography;

const ReceiptVouchersList = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { data: receipts, isLoading } = useQuery({
        queryKey: ['receipts'],
        queryFn: async () => {
            const { data } = await apiClient.get('/finance/receipts/');
            return unwrapListResponse(data);
        }
    });

    const columns = [
        {
            title: 'رقم السند',
            dataIndex: 'id',
            key: 'id',
            render: (text) => `RV-${text}`,
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
            render: (amount) => `${parseFloat(amount || 0).toLocaleString('ar-SA')} ريال`,
        },
        {
            title: 'طريقة الدفع',
            dataIndex: 'payment_method',
            key: 'payment_method',
            render: (method) => {
                const methods = {
                    cash: 'نقدي',
                    bank_transfer: 'تحويل بنكي',
                    cheque: 'شيك',
                    other: 'أخرى'
                };
                return <Tag color="blue">{methods[method] || method}</Tag>;
            }
        },
        {
            title: 'التاريخ',
            dataIndex: 'date',
            key: 'date',
        },
        {
            title: 'رقم المرجع',
            dataIndex: 'reference',
            key: 'reference',
        },
    ];

    return (
        <Card>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                <div>
                    <Title level={3} style={{ marginBottom: 4 }}>سندات القبض (الواردات)</Title>
                    <Text type="secondary">إدارة المبالغ المحصلة من الشركات والعملاء مع تتبع وسائل الدفع والمراجع.</Text>
                </div>
                <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsModalOpen(true)}>
                    إنشاء سند جديد
                </Button>
            </div>
            
            <Table 
                columns={columns} 
                dataSource={receipts || []} 
                rowKey="id" 
                loading={isLoading}
                pagination={{ pageSize: 10 }}
            />

            <VoucherModal
                open={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                mode="receipt"
            />
        </Card>
    );
};

export default ReceiptVouchersList;
