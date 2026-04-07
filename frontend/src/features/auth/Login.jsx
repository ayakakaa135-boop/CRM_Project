import React from 'react';
import { Form, Input, Button, Card, Typography, theme, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import useAuthStore from '../../store/useAuthStore';
import apiClient from '../../api/apiClient';

const { Title, Text } = Typography;

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const login = useAuthStore((state) => state.login);
  const { token } = theme.useToken();
  const { t } = useTranslation();

  const onFinish = async (values) => {
    try {
      const { data } = await apiClient.post('/auth/login/', values);
      const fullName = [data.user?.first_name, data.user?.last_name].filter(Boolean).join(' ').trim();
      const normalizedUser = {
        ...data.user,
        name: fullName || data.user?.username || values.username,
      };

      login(normalizedUser, data.access, data.refresh);
      message.success(t('loginPage.success'));

      const origin = location.state?.from?.pathname || '/dashboard';
      navigate(origin, { replace: true });
    } catch (error) {
      const detail = error.response?.data?.detail || t('loginPage.error');
      message.error(detail);
    }
  };

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh',
      background: token.colorBgLayout 
    }}>
      <Card style={{ width: 400, boxShadow: token.boxShadowSecondary }}>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <Title level={2}>{t('loginPage.title')}</Title>
          <Text type="secondary">{t('loginPage.subtitle')}</Text>
        </div>
        
        <Form
          name="login_form"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          size="large"
        >
          <Form.Item
            name="username"
            rules={[{ required: true, message: t('loginPage.usernameRequired') }]}
          >
            <Input prefix={<UserOutlined />} placeholder={t('loginPage.username')} />
          </Form.Item>
          
          <Form.Item
            name="password"
            rules={[{ required: true, message: t('loginPage.passwordRequired') }]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder={t('loginPage.password')} />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              {t('loginPage.submit')}
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default Login;
