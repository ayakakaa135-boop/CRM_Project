import React from 'react';
import { useParams } from 'react-router-dom';
import { 
  Card, 
  Typography, 
  Table, 
  Tag, 
  Result, 
  Button, 
  theme,
  Row,
  Col
} from 'antd';
import { 
  PrinterOutlined, 
  LockOutlined,
  GlobalOutlined
} from '@ant-design/icons';
import { usePublicReport } from './reportHooks';

const { Title, Text } = Typography;

const PublicReport = () => {
  const { token: shareToken } = useParams();
  const { token } = theme.useToken();
  const { data: report, isLoading, isError } = usePublicReport(shareToken);

  if (isLoading) {
    return (
      <Result
        status="info"
        title="جاري تحميل التقرير"
        subTitle="يتم الآن جلب نسخة التقرير العامة."
      />
    );
  }

  if (isError || !report) {
    return (
      <Result
        status="403"
        title="التقرير غير متوفر"
        subTitle="عذراً، قد يكون الرابط منتهياً أو أنك لا تملك الصلاحية للوصول لهذا التقرير."
        icon={<LockOutlined />}
      />
    );
  }

  const columns = [
    { title: 'الخدمة', dataIndex: 'service_type_name', key: 'service_type_name' },
    { 
      title: 'الحالة', 
      key: 'status',
      render: () => <Tag color={report.status === 'published' ? 'success' : 'processing'}>{report.status}</Tag>
    },
    { 
      title: 'ملاحظات', 
      dataIndex: 'notes', 
      key: 'notes',
      render: (value) => value || '-'
    },
  ];

  return (
    <div style={{ padding: '40px 20px', minHeight: '100vh', background: token.colorBgLayout }}>
      <div style={{ maxWidth: 900, margin: '0 auto' }}>
        <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
          <Col>
            <Title level={2}>
              <GlobalOutlined style={{ color: token.colorPrimary }} /> تقرير حالة منشأة
            </Title>
          </Col>
          <Col>
             <Button icon={<PrinterOutlined />} onClick={() => window.print()}>طباعة نسخة</Button>
          </Col>
        </Row>

        <Card style={{ borderRadius: 16, marginBottom: 24 }}>
          <Text type="secondary">بيانات الشركة:</Text>
          <Title level={3} style={{ margin: '8px 0' }}>{report.company_name}</Title>
          <Text strong>حالة التقرير: </Text><Text>{report.status}</Text>
          <br />
          <Text strong>تاريخ الإصدار: </Text><Text>{report.date}</Text>
        </Card>

        <Card title="تفاصيل الخدمات الحكومية الحالية" style={{ borderRadius: 16 }}>
          <Table 
            dataSource={report.items} 
            columns={columns} 
            rowKey="id" 
            pagination={false} 
          />
        </Card>

        {report.notes ? (
          <Card title="ملاحظات التقرير" style={{ borderRadius: 16, marginTop: 24 }}>
            <Text>{report.notes}</Text>
          </Card>
        ) : null}

        <div style={{ marginTop: 40, textAlign: 'center' }}>
          <Text type="secondary">تم إنشاء هذا التقرير تلقائياً عبر نظام CRM لخدمات الأعمال الحكومية السعودية.</Text>
        </div>
      </div>
    </div>
  );
};

export default PublicReport;
