import React, { useState } from 'react';
import { Card, Form, Input, Button, Avatar, Typography, Space, Tag, Divider, message } from 'antd';
import { UserOutlined, MailOutlined, PhoneOutlined, SafetyCertificateOutlined, SaveOutlined } from '@ant-design/icons';
import useAuthStore from '../../store/useAuthStore';

const { Title, Text } = Typography;

const Profile = () => {
  const { user } = useAuthStore();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const onFinish = (values) => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      console.log('Update Profile:', values);
      message.success('تم تحديث الملف الشخصي بنجاح');
      setLoading(false);
    }, 1000);
  };

  const getRoleTag = (role) => {
    const roles = {
      admin: { color: 'magenta', label: 'مدير نظام' },
      manager: { color: 'gold', label: 'مدير عمليات' },
      employee: { color: 'cyan', label: 'موظف' }
    };
    const config = roles[role] || { color: 'default', label: role };
    return <Tag color={config.color} icon={<SafetyCertificateOutlined />}>{config.label}</Tag>;
  };

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '24px' }}>
      <Card
        cover={
          <div style={{ 
            height: 120, 
            background: 'linear-gradient(90deg, #1890ff 0%, #722ed1 100%)',
            borderTopLeftRadius: 8,
            borderTopRightRadius: 8
          }} />
        }
      >
        <div style={{ marginTop: -60, textAlign: 'center', marginBottom: 24 }}>
          <Avatar 
            size={120} 
            icon={<UserOutlined />} 
            src={user?.avatar}
            style={{ border: '4px solid white', backgroundColor: '#f5f5f5' }}
          />
          <Title level={2} style={{ marginTop: 16, marginBottom: 0 }}>
            {user?.name || user?.username || 'المستخدم'}
          </Title>
          <div style={{ marginTop: 8 }}>
            {getRoleTag(user?.role)}
          </div>
        </div>

        <Divider orientation="left">المعلومات الشخصية</Divider>

        <Form
          form={form}
          layout="vertical"
          initialValues={{
            username: user?.username,
            first_name: user?.first_name || user?.name?.split(' ')[0],
            last_name: user?.last_name || user?.name?.split(' ')[1],
            email: user?.email,
            phone: user?.phone,
          }}
          onFinish={onFinish}
        >
          <Space size="large" style={{ display: 'flex', width: '100%' }}>
            <Form.Item 
              name="first_name" 
              label="الاسم الأول" 
              style={{ flex: 1 }}
              rules={[{ required: true, message: 'يرجى إدخال الاسم الأول' }]}
            >
              <Input prefix={<UserOutlined />} placeholder="الاسم الأول" />
            </Form.Item>
            <Form.Item 
              name="last_name" 
              label="اسم العائلة" 
              style={{ flex: 1 }}
              rules={[{ required: true, message: 'يرجى إدخال اسم العائلة' }]}
            >
              <Input prefix={<UserOutlined />} placeholder="اسم العائلة" />
            </Form.Item>
          </Space>

          <Form.Item name="username" label="اسم المستخدم">
            <Input prefix={<UserOutlined />} disabled />
          </Form.Item>

          <Form.Item 
            name="email" 
            label="البريد الإلكتروني"
            rules={[{ type: 'email', message: 'يرجى إدخال بريد إلكتروني صحيح' }]}
          >
            <Input prefix={<MailOutlined />} placeholder="example@domain.com" />
          </Form.Item>

          <Form.Item name="phone" label="رقم الجوال">
            <Input prefix={<PhoneOutlined />} placeholder="05xxxxxxxx" />
          </Form.Item>

          <Divider />

          <Form.Item>
            <Button 
              type="primary" 
              htmlType="submit" 
              icon={<SaveOutlined />} 
              loading={loading}
              block
              size="large"
            >
              حفظ التغييرات
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default Profile;
