import React, { useMemo, useState } from 'react';
import { 
  Table, 
  Button, 
  Input, 
  Space, 
  Tag, 
  Typography, 
  Card, 
  theme, 
  Popconfirm, 
  message,
  Tooltip,
  Row,
  Col,
  Statistic,
  Avatar,
  Select,
} from 'antd';
import { 
  PlusOutlined, 
  SearchOutlined, 
  EditOutlined, 
  DeleteOutlined, 
  EyeOutlined,
  ApartmentOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  StopOutlined,
} from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { useCompanies, useDeleteCompany } from './companyHooks';
import CompanyModal from './CompanyModal';

const { Title, Text } = Typography;
const companyPalette = ['#1677ff', '#13c2c2', '#52c41a', '#fa8c16', '#722ed1', '#eb2f96'];

const CompaniesList = () => {
  const { token } = theme.useToken();
  const { t } = useTranslation();
  const { data: companies = [], isLoading } = useCompanies();
  const deleteMutation = useDeleteCompany();
  
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCompany, setEditingCompany] = useState(null);

  const handleSearch = (e) => setSearchText(e.target.value);

  const filteredData = useMemo(() => companies.filter((item) => {
    const query = searchText.trim().toLowerCase();
    const matchesText =
      !query
      || item.name.toLowerCase().includes(query)
      || item.industry.toLowerCase().includes(query)
      || item.contactEmail.toLowerCase().includes(query);
    const matchesStatus = statusFilter === 'all' || item.contractStatus === statusFilter;
    return matchesText && matchesStatus;
  }), [companies, searchText, statusFilter]);

  const stats = {
    total: companies.length,
    active: companies.filter((item) => item.contractStatus === 'active').length,
    pending: companies.filter((item) => item.contractStatus === 'pending').length,
    expired: companies.filter((item) => item.contractStatus === 'expired').length,
  };

  const getCompanyIdentity = (name, index) => ({
    initials: name.split(' ').map((part) => part[0]).join('').slice(0, 2).toUpperCase(),
    color: companyPalette[index % companyPalette.length],
  });

  const handleDelete = async (id) => {
    try {
      await deleteMutation.mutateAsync(id);
      message.success(t('companiesPage.deleteSuccess'));
    } catch (error) {
      message.error(t('companiesPage.deleteError'));
    }
  };

  const openAddModal = () => {
    setEditingCompany(null);
    setIsModalOpen(true);
  };

  const openEditModal = (record) => {
    setEditingCompany(record);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingCompany(null);
  };

  const columns = [
    {
      title: t('companiesPage.name'),
      dataIndex: 'name',
      key: 'name',
      render: (text, record, index) => {
        const identity = getCompanyIdentity(text, index);
        return (
          <Space>
            <Avatar style={{ backgroundColor: identity.color, verticalAlign: 'middle' }}>
              {identity.initials}
            </Avatar>
            <div>
              <Text strong>{text}</Text>
              <br />
              <Text type="secondary" style={{ fontSize: 12 }}>{record.industry}</Text>
            </div>
          </Space>
        );
      },
    },
    {
      title: t('companiesPage.industry'),
      dataIndex: 'industry',
      key: 'industry',
    },
    {
      title: t('companiesPage.email'),
      dataIndex: 'contactEmail',
      key: 'contactEmail',
    },
    {
      title: t('companiesPage.contractStatus'),
      dataIndex: 'contractStatus',
      key: 'contractStatus',
      render: (status) => {
        let color = 'blue';
        let label = t('companiesPage.pendingLabel');
        if (status === 'active') { color = 'success'; label = t('companiesPage.activeLabel'); }
        if (status === 'expired') { color = 'error'; label = t('companiesPage.expiredLabel'); }
        return <Tag color={color}>{label}</Tag>;
      },
    },
    {
      title: t('companiesPage.createdAt'),
      dataIndex: 'createdAt',
      key: 'createdAt',
    },
    {
      title: t('companiesPage.actions'),
      key: 'actions',
      render: (_, record) => (
        <Space size="middle">
          <Tooltip title={t('common.edit')}>
            <Button 
              type="text" 
              icon={<EditOutlined style={{ color: token.colorWarning }} />} 
              onClick={() => openEditModal(record)}
            />
          </Tooltip>
          <Popconfirm
            title={t('common.delete')}
            onConfirm={() => handleDelete(record.id)}
            okText={t('common.yes')}
            cancelText={t('common.no')}
          >
            <Button 
              type="text" 
              danger 
              icon={<DeleteOutlined />} 
            />
          </Popconfirm>
          <Tooltip title={t('companiesPage.viewDetails')}>
            <Button 
              type="text" 
              icon={<EyeOutlined style={{ color: token.colorPrimary }} />} 
            />
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
        <div>
          <Title level={2} style={{ margin: 0 }}>{t('companiesPage.title')}</Title>
          <Text type="secondary">{t('companiesPage.subtitle')}</Text>
        </div>
        <Button 
          type="primary" 
          icon={<PlusOutlined />} 
          size="large"
          onClick={openAddModal}
        >
          {t('companiesPage.add')}
        </Button>
      </div>

      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false} style={{ borderRadius: 18, background: '#f8fbff' }}>
            <Statistic title={t('companiesPage.total')} value={stats.total} prefix={<ApartmentOutlined />} />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false} style={{ borderRadius: 18, background: '#f6ffed' }}>
            <Statistic title={t('companiesPage.activeContracts')} value={stats.active} prefix={<CheckCircleOutlined />} />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false} style={{ borderRadius: 18, background: '#fffbe6' }}>
            <Statistic title={t('companiesPage.inProgress')} value={stats.pending} prefix={<ClockCircleOutlined />} />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false} style={{ borderRadius: 18, background: '#fff2f0' }}>
            <Statistic title={t('companiesPage.expired')} value={stats.expired} prefix={<StopOutlined />} />
          </Card>
        </Col>
      </Row>

      <Card style={{ borderRadius: 16 }}>
        <Row gutter={[12, 12]} style={{ marginBottom: 16 }}>
          <Col xs={24} md={14}>
          <Input
            placeholder={t('companiesPage.searchPlaceholder')}
            prefix={<SearchOutlined />}
            size="large"
            value={searchText}
            onChange={handleSearch}
              style={{ width: '100%' }}
          />
          </Col>
          <Col xs={24} md={6}>
            <Select size="large" value={statusFilter} onChange={setStatusFilter} style={{ width: '100%' }}>
              <Select.Option value="all">{t('common.allStatuses')}</Select.Option>
              <Select.Option value="active">{t('common.active')}</Select.Option>
              <Select.Option value="pending">{t('common.pending')}</Select.Option>
              <Select.Option value="expired">{t('common.expired')}</Select.Option>
            </Select>
          </Col>
          <Col xs={24} md={4} style={{ display: 'flex', alignItems: 'center' }}>
            <Text type="secondary">{t('common.results')}: {filteredData.length}</Text>
          </Col>
        </Row>

        <Table 
          columns={columns} 
          dataSource={filteredData} 
          rowKey="id" 
          loading={isLoading}
          pagination={{ pageSize: 8 }}
          scroll={{ x: 'max-content' }}
        />
      </Card>

      <CompanyModal 
        isOpen={isModalOpen} 
        onClose={closeModal} 
        editingData={editingCompany} 
      />
    </div>
  );
};

export default CompaniesList;
