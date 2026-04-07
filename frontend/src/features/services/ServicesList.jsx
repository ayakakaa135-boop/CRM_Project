import React, { useState } from 'react';
import { 
  Table, 
  Button, 
  Tag, 
  Progress, 
  Typography, 
  Card, 
  Space, 
  theme,
  Input,
  Tooltip
} from 'antd';
import { 
  PlusOutlined, 
  ReloadOutlined, 
  SearchOutlined,
  FileTextOutlined
} from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { useServices } from './serviceHooks';
import NewRequestModal from './NewRequestModal';

const { Title, Text } = Typography;

const statusMap = {
  new: { color: 'cyan', label: 'طلب جديد' },
  under_review: { color: 'processing', label: 'قيد المراجعة' },
  pending_payment: { color: 'warning', label: 'بانتظار السداد' },
  completed: { color: 'success', label: 'مكتمل' },
};

const ServicesList = () => {
  const { t } = useTranslation();
  const { token } = theme.useToken();
  const { data: services, isLoading, refetch } = useServices();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchText, setSearchText] = useState('');

  const filteredData = services?.filter(item => 
    item.companyName.toLowerCase().includes(searchText.toLowerCase()) ||
    item.serviceType.toLowerCase().includes(searchText.toLowerCase()) ||
    item.govId.toLowerCase().includes(searchText.toLowerCase())
  );

  const columns = [
    {
      title: 'رقم الطلب',
      dataIndex: 'govId',
      key: 'govId',
      render: (text) => <Text code>{text}</Text>,
    },
    {
      title: 'الشركة',
      dataIndex: 'companyName',
      key: 'companyName',
      render: (text) => <Text strong>{text}</Text>,
    },
    {
      title: 'نوع الخدمة',
      dataIndex: 'serviceType',
      key: 'serviceType',
    },
    {
      title: 'تاريخ الطلب',
      dataIndex: 'requestDate',
      key: 'requestDate',
    },
    {
      title: 'حالة الطلب',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={statusMap[status]?.color || 'default'}>
          {statusMap[status]?.label || status}
        </Tag>
      ),
    },
    {
      title: 'نسبة الإنجاز',
      dataIndex: 'progress',
      key: 'progress',
      width: 200,
      render: (percent) => (
        <Progress 
          percent={percent} 
          size="small" 
          status={percent === 100 ? 'success' : 'active'} 
        />
      ),
    },
    {
      title: 'إجراءات',
      key: 'actions',
      render: () => (
        <Space>
          <Tooltip title="عرض التفاصيل">
            <Button type="text" icon={<FileTextOutlined style={{ color: token.colorPrimary }} />} />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: 24 
      }}>
        <Title level={2} style={{ margin: 0 }}>المعاملات والخدمات الحكومية</Title>
        <Space>
          <Button icon={<ReloadOutlined />} onClick={() => refetch()} />
          <Button 
            type="primary" 
            icon={<PlusOutlined />} 
            size="large"
            onClick={() => setIsModalOpen(true)}
          >
            طلب خدمة جديدة
          </Button>
        </Space>
      </div>

      <Card style={{ borderRadius: 16 }}>
        <div style={{ marginBottom: 16 }}>
          <Input
            placeholder="بحث برقم الطلب أو الشركة أو نوع الخدمة..."
            prefix={<SearchOutlined />}
            size="large"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={{ maxWidth: 450 }}
          />
        </div>

        <Table 
          columns={columns} 
          dataSource={filteredData} 
          rowKey="id" 
          loading={isLoading}
          pagination={{ pageSize: 10 }}
          scroll={{ x: 'max-content' }}
        />
      </Card>

      <NewRequestModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </div>
  );
};

export default ServicesList;
