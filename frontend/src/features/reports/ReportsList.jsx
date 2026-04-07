import React, { useMemo, useState } from 'react';
import { 
  Table, 
  Button, 
  Typography, 
  Card, 
  Space, 
  theme, 
  message, 
  Tag,
  Row,
  Col,
  Statistic,
  Input,
  Select,
} from 'antd';
import { 
  FilePdfOutlined, 
  ShareAltOutlined, 
  EyeOutlined,
  BarChartOutlined,
  DownloadOutlined,
  FileExcelOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useReports, useToggleReportShare } from './reportHooks';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const { Title, Text } = Typography;
const { Search } = Input;

const ReportsList = () => {
  const { token } = theme.useToken();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { data: reports = [], isLoading } = useReports();
  const toggleShareMutation = useToggleReportShare();
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [shareFilter, setShareFilter] = useState('all');

  const filteredReports = useMemo(() => {
    const query = searchText.trim().toLowerCase();

    return reports.filter((report) => {
      const matchesText = !query || [
        report.company_name,
        report.status,
        report.date,
      ].filter(Boolean).some((value) => String(value).toLowerCase().includes(query));

      const matchesStatus = statusFilter === 'all' || report.status === statusFilter;
      const matchesShare =
        shareFilter === 'all'
        || (shareFilter === 'shared' && report.is_shared)
        || (shareFilter === 'private' && !report.is_shared);

      return matchesText && matchesStatus && matchesShare;
    });
  }, [reports, searchText, statusFilter, shareFilter]);

  const stats = {
    total: filteredReports.length,
    shared: filteredReports.filter((report) => report.is_shared).length,
    published: filteredReports.filter((report) => report.status === 'published').length,
    latestDate: filteredReports[0]?.date || reports[0]?.date || '--',
  };

  const getStatusLabel = (status) => (
    status === 'published' ? t('reportsPage.published') : t('reportsPage.draft')
  );

  const handleShare = async (reportId) => {
    try {
      const result = await toggleShareMutation.mutateAsync(reportId);

      if (result.is_shared && result.share_url) {
        await navigator.clipboard.writeText(result.share_url);
        message.success(t('reportsPage.shareActivated'));
        return;
      }

      message.info(t('reportsPage.shareStopped'));
    } catch (error) {
      const detail = error.response?.data?.detail || t('reportsPage.shareError');
      message.error(detail);
    }
  };

  const columns = [
    {
      title: t('reportsPage.company'),
      dataIndex: 'company_name',
      key: 'company_name',
      render: (text) => <Text strong>{text}</Text>,
    },
    {
      title: t('common.status'),
      dataIndex: 'status',
      key: 'status',
      render: (status) => <Tag color={status === 'published' ? 'green' : 'blue'}>{getStatusLabel(status)}</Tag>,
    },
    {
      title: t('reportsPage.issueDate'),
      dataIndex: 'date',
      key: 'date',
    },
    {
      title: t('reportsPage.publicShare'),
      dataIndex: 'is_shared',
      key: 'is_shared',
      render: (isShared) => <Tag color={isShared ? 'green' : 'default'}>{isShared ? t('reportsPage.shareEnabled') : t('reportsPage.shareDisabled')}</Tag>,
    },
    {
      title: t('reportsPage.actions'),
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button 
            icon={<ShareAltOutlined />} 
            loading={toggleShareMutation.isPending && toggleShareMutation.variables === record.id}
            onClick={() => handleShare(record.id)}
          >
            {record.is_shared ? t('reportsPage.refreshShareLink') : t('reportsPage.enableShare')}
          </Button>
          <Button 
            type="text" 
            icon={<EyeOutlined style={{ color: token.colorPrimary }} />}
            disabled={!record.share_token}
            onClick={() => navigate(`/reports/share/${record.share_token}`)}
          >
            {t('common.preview')}
          </Button>
        </Space>
      ),
    },
  ];

  const exportRows = filteredReports.map((report) => ({
    company: report.company_name,
    status: report.status,
    date: report.date,
    shared: report.is_shared ? 'Shared' : 'Private',
    shareToken: report.share_token || '',
  }));

  const handleExportCsv = () => {
    if (!exportRows.length) {
      message.info(t('reportsPage.noDataToExport'));
      return;
    }

    const headers = ['Company', 'Status', 'Issue Date', 'Sharing', 'Share Token'];
    const rows = exportRows.map((row) => [
      row.company,
      row.status,
      row.date,
      row.shared,
      row.shareToken,
    ]);
    const csvContent = [headers, ...rows]
      .map((row) => row.map((cell) => `"${String(cell ?? '').replace(/"/g, '""')}"`).join(','))
      .join('\n');

    const blob = new Blob([`\uFEFF${csvContent}`], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `reports-export-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    message.success(t('reportsPage.csvSuccess'));
  };

  const handleExportPdf = () => {
    if (!exportRows.length) {
      message.info(t('reportsPage.noDataToExport'));
      return;
    }

    const doc = new jsPDF({ orientation: 'landscape' });
    doc.setFontSize(16);
    doc.text('Reports Export', 14, 16);
    doc.setFontSize(10);
    doc.text(`Generated at: ${new Date().toLocaleString()}`, 14, 23);

    autoTable(doc, {
      startY: 30,
      head: [['Company', 'Status', 'Issue Date', 'Sharing', 'Share Token']],
      body: exportRows.map((row) => [
        row.company,
        row.status,
        row.date,
        row.shared,
        row.shareToken,
      ]),
      styles: {
        fontSize: 9,
        cellPadding: 3,
      },
      headStyles: {
        fillColor: [24, 144, 255],
      },
    });

    doc.save(`reports-export-${new Date().toISOString().slice(0, 10)}.pdf`);
    message.success(t('reportsPage.pdfSuccess'));
  };

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ marginBottom: 24 }}>
        <Title level={2}><BarChartOutlined /> {t('reportsPage.title')}</Title>
        <Text type="secondary">{t('reportsPage.subtitle')}</Text>
      </div>

      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false} style={{ borderRadius: 16, background: '#f8fbff' }}>
            <Statistic title={t('reportsPage.total')} value={stats.total} />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false} style={{ borderRadius: 16, background: '#f6ffed' }}>
            <Statistic title={t('reportsPage.published')} value={stats.published} />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false} style={{ borderRadius: 16, background: '#fffbe6' }}>
            <Statistic title={t('reportsPage.shared')} value={stats.shared} />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false} style={{ borderRadius: 16, background: '#fff7e6' }}>
            <Statistic title={t('reportsPage.latestIssueDate')} value={stats.latestDate} />
          </Card>
        </Col>
      </Row>

      <Card style={{ borderRadius: 16 }}>
        <Row gutter={[12, 12]} style={{ marginBottom: 18 }}>
          <Col xs={24} md={10}>
            <Search
              placeholder={t('reportsPage.searchPlaceholder')}
              allowClear
              enterButton={<SearchOutlined />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
          </Col>
          <Col xs={12} md={4}>
            <Select value={statusFilter} onChange={setStatusFilter} style={{ width: '100%' }}>
              <Select.Option value="all">{t('common.allStatuses')}</Select.Option>
              <Select.Option value="published">{t('reportsPage.published')}</Select.Option>
              <Select.Option value="draft">{t('reportsPage.draft')}</Select.Option>
            </Select>
          </Col>
          <Col xs={12} md={4}>
            <Select value={shareFilter} onChange={setShareFilter} style={{ width: '100%' }}>
              <Select.Option value="all">{t('reportsPage.allShares')}</Select.Option>
              <Select.Option value="shared">{t('reportsPage.shareEnabled')}</Select.Option>
              <Select.Option value="private">{t('reportsPage.private')}</Select.Option>
            </Select>
          </Col>
          <Col xs={24} md={6}>
            <Space wrap style={{ width: '100%', justifyContent: 'flex-end' }}>
              <Button icon={<FileExcelOutlined />} onClick={handleExportCsv}>
                {t('reportsPage.exportCsv')}
              </Button>
              <Button icon={<FilePdfOutlined />} onClick={handleExportPdf}>
                {t('reportsPage.exportPdf')}
              </Button>
            </Space>
          </Col>
        </Row>

        <Table 
          columns={columns} 
          dataSource={filteredReports} 
          rowKey="id" 
          loading={isLoading}
          pagination={{ pageSize: 10 }}
        />
      </Card>
      
      <Card style={{ marginTop: 24, borderRadius: 16, background: token.colorFillAlter }}>
        <Title level={4}>{t('reportsPage.extraStatsTitle')}</Title>
        <Text>{t('reportsPage.extraStatsText')}</Text>
      </Card>
    </div>
  );
};

export default ReportsList;
