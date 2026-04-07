import React from 'react';
import { 
  Tabs, 
  Card, 
  Form, 
  Input, 
  Button, 
  Switch, 
  Divider, 
  Typography, 
  Row, 
  Col, 
  Avatar, 
  Upload,
  message,
  Select,
  theme,
  Statistic,
  Space,
} from 'antd';
import { 
  UserOutlined, 
  SettingOutlined, 
  BellOutlined, 
  LockOutlined,
  UploadOutlined,
  GlobalOutlined,
  BgColorsOutlined
} from '@ant-design/icons';
import useThemeStore from '../../store/useThemeStore';
import { useTranslation } from 'react-i18next';
import useAuthStore from '../../store/useAuthStore';
import apiClient from '../../api/apiClient';

const { Title, Text } = Typography;

const Settings = () => {
  const { token } = theme.useToken();
  const { darkMode, toggleTheme, direction, setDirection, language, setLanguage } = useThemeStore();
  const { t, i18n } = useTranslation();
  const user = useAuthStore((state) => state.user);
  const [profileForm] = Form.useForm();
  const [securityForm] = Form.useForm();

  const onProfileFinish = (values) => {
    message.success(t('settingsPage.profileUpdated'));
  };

  const onSecurityFinish = async (values) => {
    try {
      await apiClient.patch('/auth/change-password/', {
        old_password: values.oldPassword,
        new_password: values.newPassword,
      });
      securityForm.resetFields();
      message.success(t('settingsPage.passwordUpdated'));
    } catch (error) {
      const data = error.response?.data;
      const firstError = typeof data === 'object' ? Object.values(data)[0] : null;
      message.error(Array.isArray(firstError) ? firstError[0] : firstError || t('settingsPage.passwordUpdateError'));
    }
  };

  const handleLanguageChange = (lang) => {
    i18n.changeLanguage(lang);
    setLanguage(lang);
    setDirection(lang === 'ar' ? 'rtl' : 'ltr');
    message.success(lang === 'ar' ? t('settingsPage.languageChangedAr') : t('settingsPage.languageChangedEn'));
  };

  const profileTab = (
    <div style={{ padding: '12px 0' }}>
      <Row gutter={[16, 16]} style={{ marginBottom: 20 }}>
        <Col xs={24} sm={8}>
          <Card bordered={false} style={{ borderRadius: 16, background: '#f8fbff' }}>
            <Statistic title={t('settingsPage.currentRole')} value={user?.role || 'user'} />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card bordered={false} style={{ borderRadius: 16, background: '#f6ffed' }}>
            <Statistic title={t('settingsPage.systemLanguage')} value={language === 'ar' ? 'العربية' : 'English'} />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card bordered={false} style={{ borderRadius: 16, background: '#fffbe6' }}>
            <Statistic title={t('settingsPage.interfaceDirection')} value={direction.toUpperCase()} />
          </Card>
        </Col>
      </Row>
      <Row gutter={32}>
        <Col xs={24} md={6} style={{ textAlign: 'center', marginBottom: 24 }}>
          <Avatar size={120} icon={<UserOutlined />} style={{ marginBottom: 16 }} />
          <Upload showUploadList={false}>
            <Button icon={<UploadOutlined />}>{t('settingsPage.changeImage')}</Button>
          </Upload>
        </Col>
        <Col xs={24} md={18}>
          <Form
            form={profileForm}
            layout="vertical"
            onFinish={onProfileFinish}
            initialValues={{
              name: user?.name || `${user?.first_name || ''} ${user?.last_name || ''}`.trim(),
              email: user?.email || '',
              phone: user?.phone || '',
            }}
          >
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label={t('settingsPage.fullName')} name="name" rules={[{ required: true }]}>
                  <Input placeholder="أدخل اسمك..." />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label={t('settingsPage.mobileNumber')} name="phone">
                  <Input placeholder="05xxxxxxxx" />
                </Form.Item>
              </Col>
            </Row>
            <Form.Item label={t('settingsPage.email')} name="email" rules={[{ type: 'email' }]}>
              <Input placeholder="email@example.com" />
            </Form.Item>
            <Form.Item label={t('settingsPage.bio')} name="bio">
              <Input.TextArea rows={3} placeholder="اكتب نبذة قصيرة..." />
            </Form.Item>
            <Button type="primary" htmlType="submit">{t('settingsPage.saveChanges')}</Button>
          </Form>
        </Col>
      </Row>
    </div>
  );

  const securityTab = (
    <div style={{ maxWidth: 500, padding: '12px 0' }}>
      <Title level={4}><LockOutlined /> {t('settingsPage.securityTitle')}</Title>
      <Text type="secondary">{t('settingsPage.securitySubtitle')}</Text>
      <Form form={securityForm} layout="vertical" style={{ marginTop: 24 }} onFinish={onSecurityFinish}>
        <Form.Item label={t('settingsPage.currentPassword')} name="oldPassword" rules={[{ required: true }]}>
          <Input.Password />
        </Form.Item>
        <Form.Item label={t('settingsPage.newPassword')} name="newPassword" rules={[{ required: true }]}>
          <Input.Password />
        </Form.Item>
        <Form.Item
          label={t('settingsPage.confirmNewPassword')}
          name="confirmPassword"
          dependencies={['newPassword']}
          rules={[
            { required: true },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('newPassword') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error(t('settingsPage.passwordMismatch')));
              },
            }),
          ]}
        >
          <Input.Password />
        </Form.Item>
        <Button type="primary" htmlType="submit">{t('common.update')}</Button>
      </Form>
    </div>
  );

  const systemTab = (
    <div style={{ padding: '12px 0' }}>
      <Title level={4}><BgColorsOutlined /> {t('settingsPage.appearanceTitle')}</Title>
      <Row align="middle" justify="space-between" style={{ marginBottom: 16 }}>
        <Col><Text strong>{t('settingsPage.darkModeLabel')}</Text></Col>
        <Col><Switch checked={darkMode} onChange={toggleTheme} /></Col>
      </Row>
      
      <Divider />

      <Title level={4}><GlobalOutlined /> {t('settingsPage.languageRegionTitle')}</Title>
      <Row align="middle" justify="space-between" style={{ marginBottom: 16 }}>
        <Col><Text strong>{t('settingsPage.interfaceLanguage')}</Text></Col>
        <Col>
           <Select value={language} style={{ width: 120 }} onChange={handleLanguageChange}>
             <Select.Option value="ar">العربية</Select.Option>
             <Select.Option value="en">English</Select.Option>
           </Select>
        </Col>
      </Row>

      <Divider />

      <Title level={4}><BellOutlined /> {t('settingsPage.notificationsTitle')}</Title>
      <Row align="middle" justify="space-between" style={{ marginBottom: 16 }}>
        <Col>
          <Text strong>{t('settingsPage.contractsAlerts')}</Text>
          <br />
          <Text type="secondary">{t('settingsPage.contractsAlertsDesc')}</Text>
        </Col>
        <Col><Switch defaultChecked /></Col>
      </Row>
      <Row align="middle" justify="space-between" style={{ marginBottom: 16 }}>
        <Col>
          <Text strong>{t('settingsPage.serviceRequests')}</Text>
          <br />
          <Text type="secondary">{t('settingsPage.serviceRequestsDesc')}</Text>
        </Col>
        <Col><Switch defaultChecked /></Col>
      </Row>
    </div>
  );

  const items = [
    { key: '1', label: t('settingsPage.profile'), icon: <UserOutlined />, children: profileTab },
    { key: '2', label: t('settingsPage.security'), icon: <LockOutlined />, children: securityTab },
    { key: '3', label: t('settingsPage.preferences'), icon: <SettingOutlined />, children: systemTab },
  ];

  return (
    <div style={{ padding: '24px' }}>
      <Title level={2}><SettingOutlined /> {t('settingsPage.title')}</Title>
      <Text type="secondary">{t('settingsPage.subtitle')}</Text>

      <Card
        style={{
          marginTop: 24,
          borderRadius: 18,
          background: 'linear-gradient(135deg, #eff6ff 0%, #f8fafc 55%, #fff7ed 100%)',
          border: '1px solid #e5e7eb',
        }}
      >
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} md={16}>
            <Space direction="vertical" size={6}>
              <Title level={3} style={{ margin: 0 }}>{t('settingsPage.heroTitle')}</Title>
              <Text type="secondary">{t('settingsPage.heroSubtitle')}</Text>
            </Space>
          </Col>
          <Col xs={24} md={8}>
            <Row gutter={[12, 12]}>
              <Col span={12}>
                <Card bordered={false} style={{ borderRadius: 14 }}>
                  <Statistic title={t('settingsPage.mode')} value={darkMode ? 'Dark' : 'Light'} />
                </Card>
              </Col>
              <Col span={12}>
                <Card bordered={false} style={{ borderRadius: 14 }}>
                  <Statistic title={t('settingsPage.systemLanguage')} value={language === 'ar' ? 'AR' : 'EN'} />
                </Card>
              </Col>
            </Row>
          </Col>
        </Row>
      </Card>

      <Card style={{ marginTop: 24, borderRadius: 16 }}>
        <Tabs defaultActiveKey="1" items={items} />
      </Card>
    </div>
  );
};

export default Settings;
