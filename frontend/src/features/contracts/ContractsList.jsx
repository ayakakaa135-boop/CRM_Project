import React, { useMemo, useState } from 'react';
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
  Progress,
  Tooltip,
  Input,
  Select,
} from 'antd';
import { 
  PlusOutlined, 
  FileDoneOutlined, 
  FileProtectOutlined, 
  WarningOutlined,
  HistoryOutlined,
  ScheduleOutlined
} from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { useContracts, useContractStats } from './contractHooks';
import ContractModal from './ContractModal';

const { Title, Text } = Typography;

const ContractsList = () => {
  const { token } = theme.useToken();
  const { t } = useTranslation();
  const { data: contracts = [], isLoading: loadingContracts } = useContracts();
  const { data: stats, isLoading: loadingStats } = useContractStats();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'success';
      case 'warning': return 'warning';
      case 'expired': return 'error';
      default: return 'default';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'active': return t('contractsPage.activeLabel');
      case 'warning': return t('contractsPage.warningLabel');
      case 'expired': return t('contractsPage.expiredLabel');
      default: return status;
    }
  };

  const filteredContracts = useMemo(() => contracts.filter((record) => {
    const query = searchText.trim().toLowerCase();
    const matchesText =
      !query
      || record.title.toLowerCase().includes(query)
      || record.companyName.toLowerCase().includes(query)
      || record.type.toLowerCase().includes(query);
    const matchesStatus = statusFilter === 'all' || record.calculatedStatus === statusFilter;
    return matchesText && matchesStatus;
  }), [contracts, searchText, statusFilter]);

  const columns = [
    {
      title: t('contractsPage.contractTitle'),
      dataIndex: 'title',
      key: 'title',
      render: (text) => <Text strong>{text}</Text>
    },
    {
      title: t('contractsPage.company'),
      dataIndex: 'companyName',
      key: 'companyName',
    },
    {
      title: t('contractsPage.type'),
      dataIndex: 'type',
      key: 'type',
      render: (type) => <Tag color="blue">{type}</Tag>
    },
    {
      title: t('contractsPage.value'),
      dataIndex: 'value',
      key: 'value',
      render: (val) => `${val.toLocaleString('ar-SA')} ريال`
    },
    {
      title: t('contractsPage.timeStatus'),
      key: 'status',
      render: (_, record) => (
        <Space direction="vertical" size={0}>
          <Tag color={getStatusColor(record.calculatedStatus)}>
            {getStatusLabel(record.calculatedStatus)}
          </Tag>
          <Text type="secondary" style={{ fontSize: '12px' }}>
            {record.daysRemaining > 0 ? t('contractsPage.daysRemaining', { count: record.daysRemaining }) : t('contractsPage.endedAgo')}
          </Text>
        </Space>
      ),
    },
    {
      title: t('contractsPage.validity'),
      key: 'validity',
      render: (_, record) => {
        const percent = record.calculatedStatus === 'expired' ? 100 : Math.max(0, 100 - (record.daysRemaining / 365 * 100));
        return (
          <Tooltip title={`${record.startDate} إلى ${record.endDate}`}>
            <Progress 
                percent={Math.round(percent)} 
                size="small" 
                status={record.calculatedStatus === 'expired' ? 'exception' : 'normal'}
                format={() => `${record.endDate}`}
                strokeColor={record.daysRemaining <= 30 ? token.colorWarning : undefined}
            />
          </Tooltip>
        );
      }
    },
    {
      title: t('contractsPage.actions'),
      key: 'actions',
      render: () => (
        <Button type="link">{t('contractsPage.renew')}</Button>
      ),
    },
  ];

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <Title level={2} style={{ margin: 0 }}><FileProtectOutlined /> {t('contractsPage.title')}</Title>
        <Button 
          type="primary" 
          icon={<PlusOutlined />} 
          size="large"
          onClick={() => setIsModalOpen(true)}
        >
          {t('contractsPage.add')}
        </Button>
      </div>

      {/* Contract Summary Cards */}
      <Row gutter={[24, 24]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card style={{ borderRadius: 16 }}>
            <Statistic 
                title={t('contractsPage.activeValue')} 
                value={stats?.totalActiveValue} 
                prefix={<FileDoneOutlined />} 
                suffix="SR"
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card style={{ borderRadius: 16 }}>
            <Statistic 
                title={t('contractsPage.expiringSoon')} 
                value={stats?.expiringSoon} 
                prefix={<WarningOutlined />} 
                valueStyle={{ color: token.colorWarning }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card style={{ borderRadius: 16 }}>
            <Statistic 
                title={t('contractsPage.activeNow')} 
                value={stats?.activeCount} 
                prefix={<ScheduleOutlined />}
                valueStyle={{ color: token.colorSuccess }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card style={{ borderRadius: 16 }}>
            <Statistic 
                title={t('contractsPage.expiredThisMonth')} 
                value={stats?.expiredThisMonth} 
                prefix={<HistoryOutlined />}
                valueStyle={{ color: token.colorError }}
            />
          </Card>
        </Col>
      </Row>

      <Card style={{ borderRadius: 16 }}>
        <Row gutter={[12, 12]} style={{ marginBottom: 18 }}>
          <Col xs={24} md={14}>
            <Input
              size="large"
              placeholder={t('contractsPage.searchPlaceholder')}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
          </Col>
          <Col xs={24} md={6}>
            <Select size="large" value={statusFilter} onChange={setStatusFilter} style={{ width: '100%' }}>
              <Select.Option value="all">{t('contractsPage.allStatuses')}</Select.Option>
              <Select.Option value="active">{t('contractsPage.activeLabel')}</Select.Option>
              <Select.Option value="warning">{t('contractsPage.warningLabel')}</Select.Option>
              <Select.Option value="expired">{t('contractsPage.expiredLabel')}</Select.Option>
            </Select>
          </Col>
          <Col xs={24} md={4} style={{ display: 'flex', alignItems: 'center' }}>
            <Text type="secondary">{t('contractsPage.displayed')}: {filteredContracts.length}</Text>
          </Col>
        </Row>
        <Table 
          columns={columns} 
          dataSource={filteredContracts} 
          rowKey="id" 
          loading={loadingContracts}
          pagination={{ pageSize: 8 }}
          scroll={{ x: 'max-content' }}
        />
      </Card>

      <ContractModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </div>
  );
};

export default ContractsList;
