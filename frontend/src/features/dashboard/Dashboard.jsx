import React from 'react';
import { Row, Col, Card, Statistic, Table, Typography, theme, Spin, Progress, Space } from 'antd';
import { 
  BankOutlined, 
  FileTextOutlined, 
  DollarCircleOutlined, 
  HourglassOutlined,
  ArrowUpOutlined,
  RiseOutlined,
  TrophyOutlined,
} from '@ant-design/icons';
import { Line, Pie } from '@ant-design/plots';
import { useTranslation } from 'react-i18next';
import { useDashboardData } from './dashboardHooks';

const { Title, Text } = Typography;

const Dashboard = () => {
  const { t } = useTranslation();
  const { token } = theme.useToken();
  const { data, isLoading } = useDashboardData();

  if (isLoading) {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}><Spin size="large" /></div>;
  }

  const cardStyle = {
    borderRadius: 20,
    boxShadow: token.boxShadowTertiary,
    background: token.colorBgContainer,
    border: `1px solid ${token.colorBorderSecondary}`,
  };

  const lineConfig = {
    data: data.revenueData,
    padding: 'auto',
    xField: 'month',
    yField: 'revenue',
    smooth: true,
    color: token.colorPrimary,
    point: { size: 5, shape: 'diamond' },
    label: { style: { fill: token.colorTextSecondary } },
  };

  const pieConfig = {
    appendPadding: 10,
    data: data.serviceDistribution,
    angleField: 'value',
    colorField: 'type',
    radius: 0.8,
    label: { type: 'outer', content: '{name} {percentage}' },
    interactions: [{ type: 'element-active' }],
  };

  const columns = [
    { title: 'الشركة', dataIndex: 'name', key: 'name' },
    { title: 'الصناعة', dataIndex: 'industry', key: 'industry' },
    { title: 'تاريخ التسجيل', dataIndex: 'date', key: 'date' },
  ];

  const serviceColumns = [
    { title: 'الخدمة', dataIndex: 'name', key: 'name' },
    { title: 'الحجم', dataIndex: 'volume', key: 'volume' },
    { title: 'النمو', dataIndex: 'growth', key: 'growth' },
  ];

  return (
    <div style={{ padding: '24px' }}>
      <Card
        style={{
          ...cardStyle,
          marginBottom: 24,
          overflow: 'hidden',
          background: 'linear-gradient(135deg, #0f172a 0%, #155e75 48%, #f59e0b 100%)',
          color: '#fff',
          border: 'none',
        }}
        bodyStyle={{ padding: 28 }}
      >
        <Row gutter={[24, 24]} align="middle">
          <Col xs={24} lg={15}>
            <Space direction="vertical" size={10}>
              <Text style={{ color: 'rgba(255,255,255,0.82)', fontSize: 14 }}>MAYAN CRM</Text>
              <Title level={2} style={{ margin: 0, color: '#fff' }}>
                {t('dashboardPage.heroTitle')}
              </Title>
              <Text style={{ color: 'rgba(255,255,255,0.86)', fontSize: 15, maxWidth: 700 }}>
                {t('dashboardPage.heroSubtitle')}
              </Text>
              <Space wrap size="large" style={{ marginTop: 8 }}>
                {data.highlights.map((item) => (
                  <div
                    key={item.label}
                    style={{
                      minWidth: 180,
                      padding: '14px 16px',
                      borderRadius: 16,
                      background: 'rgba(255,255,255,0.14)',
                      backdropFilter: 'blur(10px)',
                    }}
                  >
                    <Text style={{ color: 'rgba(255,255,255,0.78)', display: 'block' }}>{item.label}</Text>
                    <Title level={3} style={{ color: '#fff', margin: '6px 0 0' }}>{item.value}</Title>
                  </div>
                ))}
              </Space>
            </Space>
          </Col>
          <Col xs={24} lg={9}>
            <Card
              bordered={false}
              style={{ borderRadius: 18, background: 'rgba(255,255,255,0.12)' }}
              bodyStyle={{ padding: 20 }}
            >
              <Space direction="vertical" size={18} style={{ width: '100%' }}>
                <div>
                  <Text style={{ color: 'rgba(255,255,255,0.78)' }}>{t('dashboardPage.portfolioReadiness')}</Text>
                  <Progress percent={data.spotlight.portfolioScore} strokeColor="#fff" trailColor="rgba(255,255,255,0.22)" />
                </div>
                <div>
                  <Text style={{ color: 'rgba(255,255,255,0.78)' }}>{t('dashboardPage.successRate')}</Text>
                  <Progress percent={data.spotlight.successRate} strokeColor="#fde68a" trailColor="rgba(255,255,255,0.22)" />
                </div>
                <Space align="center">
                  <TrophyOutlined style={{ color: '#fde68a', fontSize: 22 }} />
                  <Text style={{ color: '#fff' }}>{t('dashboardPage.showcaseReady')}</Text>
                </Space>
              </Space>
            </Card>
          </Col>
        </Row>
      </Card>
      
      <Title level={2} style={{ marginBottom: 24 }}>{t('dashboard')}</Title>
      
      <Row gutter={[24, 24]}>
        <Col xs={24} sm={12} lg={6}>
          <Card style={cardStyle}>
            <Statistic
              title={t('dashboardPage.totalCompanies')}
              value={data.totalCompanies}
              prefix={<BankOutlined style={{ color: token.colorPrimary }} />}
              suffix={
                <Text type="success" style={{ fontSize: 12 }}>
                  <ArrowUpOutlined /> {data.companiesGrowth}%
                </Text>
              }
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card style={cardStyle}>
            <Statistic
              title={t('dashboardPage.activeContracts')}
              value={data.activeContracts}
              prefix={<FileTextOutlined style={{ color: '#52c41a' }} />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card style={cardStyle}>
            <Statistic
              title={t('dashboardPage.outstandingPayments')}
              value={data.outstandingPayments}
              precision={2}
              prefix={<DollarCircleOutlined style={{ color: '#faad14' }} />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card style={cardStyle}>
            <Statistic
              title={t('dashboardPage.pendingRequests')}
              value={data.pendingRequests}
              prefix={<HourglassOutlined style={{ color: '#ff4d4f' }} />}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[24, 24]} style={{ marginTop: 24 }}>
        <Col xs={24} lg={16}>
          <Card 
            title={t('dashboardPage.revenueGrowth')} 
            style={cardStyle}
          >
            <div style={{ height: 350 }}>
              <Line {...lineConfig} />
            </div>
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card 
            title={t('dashboardPage.serviceDistribution')} 
            style={cardStyle}
          >
            <div style={{ height: 350 }}>
              <Pie {...pieConfig} />
            </div>
          </Card>
        </Col>
      </Row>

      <Row gutter={[24, 24]} style={{ marginTop: 24 }}>
        <Col xs={24} xl={15}>
          <Card 
            title={t('dashboardPage.recentCompanies')} 
            style={cardStyle}
            extra={<a href="/companies">{t('common.viewAll')}</a>}
          >
            <Table 
              dataSource={data.recentCompanies} 
              columns={columns} 
              rowKey="id" 
              pagination={false} 
            />
          </Card>
        </Col>
        <Col xs={24} xl={9}>
          <Card title={t('dashboardPage.topServices')} style={cardStyle}>
            <Table
              dataSource={data.topServices}
              columns={serviceColumns}
              rowKey="id"
              pagination={false}
              size="small"
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
