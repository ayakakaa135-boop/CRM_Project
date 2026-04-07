import React, { useState } from 'react';
import { Layout, Menu, Button, theme, Space, Dropdown, Avatar, Typography } from 'antd';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  DashboardOutlined,
  UserOutlined,
  SettingOutlined,
  LogoutOutlined,
  GlobalOutlined,
  BulbOutlined,
  FileTextOutlined,
  TeamOutlined,
  DollarOutlined,
  FilePdfOutlined,
  DollarCircleOutlined,
  SyncOutlined,
  FileProtectOutlined,
} from '@ant-design/icons';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import useThemeStore from '../store/useThemeStore';
import useAuthStore from '../store/useAuthStore';

const { Header, Sider, Content } = Layout;
const { Text } = Typography;

const MainLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const { darkMode, direction, language, toggleDarkMode, setLanguage } = useThemeStore();
  const { user, logout } = useAuthStore();
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const handleLanguageChange = (lang) => {
    setLanguage(lang);
    i18n.changeLanguage(lang);
  };

  const menuItems = [
    {
      key: '/dashboard',
      icon: <DashboardOutlined />,
      label: t('dashboard'),
    },
    {
      key: '/companies',
      icon: <TeamOutlined />,
      label: t('menu.companies'),
    },
    {
      key: '/services',
      icon: <FileTextOutlined />,
      label: t('menu.services'),
    },
    {
      key: '/contracts',
      icon: <FileTextOutlined />,
      label: t('menu.contracts'),
    },
    {
      key: '/subscriptions',
      icon: <SyncOutlined />,
      label: t('menu.subscriptions'),
    },
    {
      key: '/finance',
      icon: <DollarOutlined />,
      label: t('menu.finance'),
      children: [
        { key: '/finance/receipts', label: t('menu.receipts') },
        { key: '/finance/payments', label: t('menu.payments') },
      ],
    },
    {
      key: '/employees',
      icon: <UserOutlined />,
      label: t('menu.employees'),
      children: [
        { key: '/employees', label: t('menu.staff') },
        { key: '/employees/commissions', label: t('menu.commissions') },
        { key: '/employees/requests', label: t('menu.requests') },
      ],
    },
    {
      key: '/reports',
      icon: <FileTextOutlined />,
      label: t('menu.reports'),
    },
    {
      key: '/settings',
      icon: <SettingOutlined />,
      label: t('settings'),
    },
  ];

  const userMenuItems = [
    {
      key: '/profile',
      label: t('userMenu.profile'),
      icon: <UserOutlined />,
    },
    {
      type: 'divider',
    },
    {
      key: '/finance',
      icon: <DollarCircleOutlined />,
      label: t('userMenu.finance'),
    },
    {
      key: '/contracts',
      icon: <FileProtectOutlined />,
      label: t('userMenu.contracts'),
    },
    {
      key: '/settings',
      icon: <SettingOutlined />,
      label: t('userMenu.settings'),
    },
    {
      key: 'logout',
      label: t('userMenu.logout'),
      icon: <LogoutOutlined />,
      danger: true,
    },
  ];

  const handleUserMenuClick = ({ key }) => {
    if (key === 'logout') {
      logout();
    } else {
      navigate(key);
    }
  };

  return (
    <Layout style={{ minHeight: '100vh', direction }}>
      <Sider 
        collapsible 
        collapsed={collapsed} 
        onCollapse={(value) => setCollapsed(value)}
        reverseArrow={direction === 'rtl'}
        theme={darkMode ? 'dark' : 'light'}
        style={{
          overflow: 'auto',
          height: '100vh',
          position: 'fixed',
          [direction === 'rtl' ? 'right' : 'left']: 0,
          top: 0,
          bottom: 0,
          zIndex: 100,
          boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
        }}
      >
        <div style={{ 
          minHeight: collapsed ? 92 : 124,
          display: 'flex', 
          flexDirection: 'column',
          alignItems: 'center', 
          justifyContent: 'center',
          gap: 6,
          padding: collapsed ? '14px 8px' : '18px 12px',
          borderBottom: darkMode ? '1px solid #303030' : '1px solid #f0f0f0' 
        }}>
          <img 
            src="/logo.png" 
            alt="Logo" 
            style={{ 
              width: collapsed ? '52px' : '86px',
              height: collapsed ? '52px' : '86px',
              objectFit: 'contain',
              filter: darkMode ? 'drop-shadow(0 3px 10px rgba(0,0,0,0.35))' : 'drop-shadow(0 4px 12px rgba(22, 119, 255, 0.12))',
              transition: 'all 0.2s'
            }} 
          />
          {!collapsed && (
            <Text
              strong
              style={{
                fontSize: 16,
                letterSpacing: 0.4,
                color: darkMode ? '#f5f5f5' : '#1f2937',
              }}
            >
              MAYAN CRM
            </Text>
          )}
        </div>
        <Menu 
          theme={darkMode ? 'dark' : 'light'} 
          selectedKeys={[location.pathname]} 
          mode="inline" 
          items={menuItems} 
          onClick={({ key }) => navigate(key)}
        />
      </Sider>
      <Layout style={{ marginLeft: direction === 'ltr' ? (collapsed ? 80 : 200) : 0, marginRight: direction === 'rtl' ? (collapsed ? 80 : 200) : 0, transition: 'all 0.2s' }}>
        <Header style={{ padding: '0 16px', background: colorBgContainer, display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 99, width: '100%' }}>
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{ fontSize: '16px', width: 64, height: 64 }}
          />
          
          <Space size="middle">
            <Button 
                type="text" 
                icon={<BulbOutlined />} 
                onClick={toggleDarkMode}
                title={darkMode ? t('lightMode') : t('darkMode')}
            />
            
            <Dropdown
              menu={{
                items: [
                  { key: 'ar', label: 'العربية', onClick: () => handleLanguageChange('ar') },
                  { key: 'en', label: 'English', onClick: () => handleLanguageChange('en') },
                ],
              }}
            >
              <Button type="text" icon={<GlobalOutlined />}>
                {language === 'ar' ? 'العربية' : 'English'}
              </Button>
            </Dropdown>

            <Dropdown menu={{ items: userMenuItems, onClick: handleUserMenuClick }}>
              <Space style={{ cursor: 'pointer' }}>
                <Avatar icon={<UserOutlined />} />
                <span>{user?.name || 'User'}</span>
              </Space>
            </Dropdown>
          </Space>
        </Header>
        <Content
          style={{
            margin: '24px 16px',
            padding: 24,
            minHeight: 280,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default MainLayout;
