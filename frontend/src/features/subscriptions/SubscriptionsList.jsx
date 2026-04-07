import React, { useMemo, useState } from 'react';
import { Table, Tag, Button, Card, Typography, Space, Tooltip, Row, Col, Statistic, Input, Select, Progress } from 'antd';
import { PlusOutlined, EditOutlined, SyncOutlined, WalletOutlined, CalendarOutlined, CheckCircleOutlined, SearchOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { useSubscriptions } from './subscriptionsHooks';

const { Title, Text } = Typography;
const { Search } = Input;

const SubscriptionsList = () => {
    const { t } = useTranslation();
    const { data: subscriptions = [], isLoading } = useSubscriptions();
    const [searchText, setSearchText] = useState('');
    const [cycleFilter, setCycleFilter] = useState('all');
    const [statusFilter, setStatusFilter] = useState('all');

    const filteredSubscriptions = useMemo(() => subscriptions.filter((record) => {
        const query = searchText.trim().toLowerCase();
        const matchesText =
            !query
            || (record.company_name || '').toLowerCase().includes(query)
            || (record.service_name || '').toLowerCase().includes(query);
        const matchesCycle = cycleFilter === 'all' || record.billing_cycle === cycleFilter;
        const matchesStatus = statusFilter === 'all' || record.status === statusFilter;
        return matchesText && matchesCycle && matchesStatus;
    }), [subscriptions, searchText, cycleFilter, statusFilter]);

    const stats = {
        total: subscriptions.length,
        active: subscriptions.filter((item) => item.status === 'active').length,
        monthly: subscriptions.filter((item) => item.billing_cycle === 'monthly').length,
        revenue: subscriptions.reduce((sum, item) => sum + Number.parseFloat(item.price || 0), 0),
    };

    const columns = [
        {
            title: t('subscriptionsPage.company'),
            dataIndex: ['company', 'name'],
            key: 'company',
            render: (text, record) => (
                <div>
                    <div style={{ fontWeight: 'bold' }}>{record.company_name || text}</div>
                    <Text type="secondary" style={{ fontSize: '12px' }}>ID: {record.id}</Text>
                </div>
            ),
        },
        {
            title: t('subscriptionsPage.service'),
            dataIndex: 'service_name',
            key: 'service_name',
        },
        {
            title: t('subscriptionsPage.value'),
            dataIndex: 'price',
            key: 'price',
            render: (price) => `${parseFloat(price).toLocaleString()} ريال`,
        },
        {
            title: t('subscriptionsPage.cycle'),
            dataIndex: 'billing_cycle',
            key: 'billing_cycle',
            render: (cycle) => {
                const cycles = {
                    monthly: t('subscriptionsPage.monthly'),
                    quarterly: t('subscriptionsPage.quarterly'),
                    yearly: t('subscriptionsPage.yearly')
                };
                return <Tag color="blue">{cycles[cycle] || cycle}</Tag>;
            }
        },
        {
            title: t('subscriptionsPage.startDate'),
            dataIndex: 'start_date',
            key: 'start_date',
        },
        {
            title: t('subscriptionsPage.renewalDate'),
            dataIndex: 'next_billing_date',
            key: 'next_billing_date',
            render: (date) => (
                <Space direction="vertical" size={2}>
                    <Text type={new Date(date) < new Date() ? 'danger' : 'success'}>{date}</Text>
                    <Progress
                        percent={Math.max(10, Math.min(100, 100 - Math.floor((new Date(date) - new Date()) / (1000 * 60 * 60 * 24 * 3))))}
                        size="small"
                        showInfo={false}
                        strokeColor={new Date(date) < new Date() ? '#ff4d4f' : '#52c41a'}
                    />
                </Space>
            ),
        },
        {
            title: t('subscriptionsPage.status'),
            dataIndex: 'status',
            key: 'status',
            render: (status) => {
                const statuses = {
                    active: { color: 'green', label: t('common.active') },
                    expired: { color: 'red', label: t('common.expired') },
                    cancelled: { color: 'gray', label: t('subscriptionsPage.cancelled') }
                };
                const config = statuses[status] || { color: 'default', label: status };
                return <Tag color={config.color}>{config.label}</Tag>;
            }
        },
        {
            title: t('subscriptionsPage.actions'),
            key: 'actions',
            render: () => (
                <Space>
                    <Tooltip title={t('subscriptionsPage.renew')}>
                        <Button shape="circle" icon={<SyncOutlined />} size="small" />
                    </Tooltip>
                    <Tooltip title={t('common.edit')}>
                        <Button shape="circle" icon={<EditOutlined />} size="small" />
                    </Tooltip>
                </Space>
            ),
        },
    ];

    return (
        <Card>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                <div>
                    <Title level={3} style={{ marginBottom: 4 }}>{t('subscriptionsPage.title')}</Title>
                    <Text type="secondary">{t('subscriptionsPage.subtitle')}</Text>
                </div>
                <Button type="primary" icon={<PlusOutlined />}>
                    {t('subscriptionsPage.add')}
                </Button>
            </div>

            <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
                <Col xs={24} sm={12} lg={6}>
                    <Card bordered={false} style={{ borderRadius: 16, background: '#f8fbff' }}>
                        <Statistic title={t('subscriptionsPage.total')} value={stats.total} prefix={<WalletOutlined />} />
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card bordered={false} style={{ borderRadius: 16, background: '#f6ffed' }}>
                        <Statistic title={t('subscriptionsPage.active')} value={stats.active} prefix={<CheckCircleOutlined />} />
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card bordered={false} style={{ borderRadius: 16, background: '#fffbe6' }}>
                        <Statistic title={t('subscriptionsPage.monthly')} value={stats.monthly} prefix={<CalendarOutlined />} />
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card bordered={false} style={{ borderRadius: 16, background: '#fff7e6' }}>
                        <Statistic title={t('subscriptionsPage.totalValue')} value={stats.revenue} suffix="ر.س" />
                    </Card>
                </Col>
            </Row>

            <Row gutter={[12, 12]} style={{ marginBottom: 18 }}>
                <Col xs={24} md={10}>
                    <Search
                        placeholder={t('subscriptionsPage.searchPlaceholder')}
                        allowClear
                        enterButton={<SearchOutlined />}
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                    />
                </Col>
                <Col xs={12} md={4}>
                    <Select value={cycleFilter} onChange={setCycleFilter} style={{ width: '100%' }}>
                        <Select.Option value="all">{t('subscriptionsPage.allCycles')}</Select.Option>
                        <Select.Option value="monthly">{t('subscriptionsPage.monthly')}</Select.Option>
                        <Select.Option value="quarterly">{t('subscriptionsPage.quarterly')}</Select.Option>
                        <Select.Option value="yearly">{t('subscriptionsPage.yearly')}</Select.Option>
                    </Select>
                </Col>
                <Col xs={12} md={4}>
                    <Select value={statusFilter} onChange={setStatusFilter} style={{ width: '100%' }}>
                        <Select.Option value="all">{t('common.allStatuses')}</Select.Option>
                        <Select.Option value="active">{t('common.active')}</Select.Option>
                        <Select.Option value="expired">{t('common.expired')}</Select.Option>
                        <Select.Option value="cancelled">{t('subscriptionsPage.cancelled')}</Select.Option>
                    </Select>
                </Col>
                <Col xs={24} md={6} style={{ display: 'flex', alignItems: 'center' }}>
                    <Text type="secondary">{t('common.results')}: {filteredSubscriptions.length}</Text>
                </Col>
            </Row>
            
            <Table 
                columns={columns} 
                dataSource={filteredSubscriptions} 
                rowKey="id" 
                loading={isLoading}
                pagination={{ pageSize: 10 }}
            />
        </Card>
    );
};

export default SubscriptionsList;
