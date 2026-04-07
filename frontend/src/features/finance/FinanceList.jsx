import React, { useState } from 'react';
import { 
  Table, 
  Button, 
  Tag, 
  Typography, 
  Card, 
  Row, 
  Col, 
  Statistic, 
  Space, 
  theme,
  Input,
  Tooltip
} from 'antd';
import { 
  PlusOutlined, 
  ArrowUpOutlined, 
  ArrowDownOutlined, 
  SearchOutlined,
  PrinterOutlined,
  DollarCircleOutlined,
  ContainerOutlined
} from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { useTransactions, useWalletStats } from './financeHooks';
import TransactionModal from './TransactionModal';

const { Title, Text } = Typography;

const FinanceList = () => {
  const { token } = theme.useToken();
  const { data: transactions, isLoading: loadingTx } = useTransactions();
  const { data: stats, isLoading: loadingStats } = useWalletStats();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchText, setSearchText] = useState('');

  const filteredData = transactions?.filter(item => 
    item.companyName.toLowerCase().includes(searchText.toLowerCase()) ||
    item.id.toString().includes(searchText)
  );

  const columns = [
    {
      title: 'رقم السند',
      dataIndex: 'id',
      key: 'id',
      render: (id) => <Text code>{id}</Text>
    },
    {
      title: 'المنشأة المستفيدة',
      dataIndex: 'companyName',
      key: 'companyName',
      render: (text) => <Text strong>{text}</Text>
    },
    {
      title: 'نوع السند',
      dataIndex: 'type',
      key: 'type',
      render: (type) => (
        <Tag color={type === 'receipt' ? 'success' : 'error'} icon={type === 'receipt' ? <ArrowUpOutlined /> : <ArrowDownOutlined />}>
          {type === 'receipt' ? 'سند قبض' : 'سند صرف'}
        </Tag>
      ),
    },
    {
      title: 'المبلغ (ريال)',
      dataIndex: 'amount',
      key: 'amount',
      render: (val) => val.toLocaleString('ar-SA')
    },
    {
      title: 'الضريبة (15%)',
      dataIndex: 'vat',
      key: 'vat',
      render: (val) => <Text type="secondary">{val.toLocaleString('ar-SA')}</Text>
    },
    {
      title: 'الإجمالي',
      dataIndex: 'total',
      key: 'total',
      render: (val) => <Text strong style={{ color: token.colorPrimary }}>{val.toLocaleString('ar-SA')}</Text>
    },
    {
        title: 'طريقة الدفع',
        dataIndex: 'method',
        key: 'method',
      },
    {
      title: 'التاريخ',
      dataIndex: 'date',
      key: 'date',
    },
    {
      title: 'إجراءات',
      key: 'actions',
      render: () => (
        <Tooltip title="طباعة السند">
          <Button type="text" icon={<PrinterOutlined />} onClick={() => window.print()} />
        </Tooltip>
      ),
    },
  ];

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <Title level={2} style={{ margin: 0 }}><DollarCircleOutlined /> الإدارة المالية والسندات</Title>
        <Button 
          type="primary" 
          icon={<PlusOutlined />} 
          size="large"
          onClick={() => setIsModalOpen(true)}
        >
          إصدار سند جديد
        </Button>
      </div>

      {/* Financial Stats Grid */}
      <Row gutter={[24, 24]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card style={{ borderRadius: 16 }}>
            <Statistic title="إجمالي الدخل (سندات قبض)" value={stats?.totalIncome} prefix="SR" valueStyle={{ color: '#3f8600' }} />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card style={{ borderRadius: 16 }}>
            <Statistic title="إجمالي مصروفات الخدمات" value={stats?.totalExpenses} prefix="SR" valueStyle={{ color: '#cf1322' }} />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card style={{ borderRadius: 16 }}>
            <Statistic title="مبالغ تحت التحصيل" value={stats?.pendingReceivables} prefix="SR" />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card style={{ borderRadius: 16 }}>
            <Statistic title="ضريبة القيمة المضافة" value={stats?.vatCollected} prefix="SR" />
          </Card>
        </Col>
      </Row>

      <Card style={{ borderRadius: 16 }}>
        <div style={{ marginBottom: 16 }}>
          <Input
            placeholder="بحث برقم السند أو اسم الشركة..."
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
          loading={loadingTx}
          pagination={{ pageSize: 8 }}
          scroll={{ x: 'max-content' }}
        />
      </Card>

      <TransactionModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </div>
  );
};

export default FinanceList;
