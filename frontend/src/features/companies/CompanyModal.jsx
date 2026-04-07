import React, { useEffect } from 'react';
import { 
  Modal, 
  Form, 
  Input, 
  Select, 
  message 
} from 'antd';
import { useCreateCompany, useUpdateCompany } from './companyHooks';

const { Option } = Select;

const CompanyModal = ({ isOpen, onClose, editingData }) => {
  const [form] = Form.useForm();
  const createMutation = useCreateCompany();
  const updateMutation = useUpdateCompany();

  useEffect(() => {
    if (editingData) {
      form.setFieldsValue(editingData);
    } else {
      form.resetFields();
    }
  }, [editingData, form, isOpen]);

  const onFinish = async (values) => {
    try {
      if (editingData) {
        await updateMutation.mutateAsync({ ...editingData, ...values });
        message.success('تم تحديث بيانات الشركة بنجاح');
      } else {
        await createMutation.mutateAsync(values);
        message.success('تمت إضافة الشركة بنجاح');
      }
      onClose();
    } catch (error) {
      message.error('فشل في حفظ البيانات');
    }
  };

  return (
    <Modal
      title={editingData ? 'تعديل بيانات الشركة' : 'إضافة شركة جديدة'}
      open={isOpen}
      onCancel={onClose}
      onOk={() => form.submit()}
      confirmLoading={createMutation.isPending || updateMutation.isPending}
      okText="حفظ"
      cancelText="إلغاء"
      width={600}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={{ contractStatus: 'active' }}
        style={{ marginTop: 24 }}
      >
        <Form.Item
          name="name"
          label="اسم الشركة"
          rules={[{ required: true, message: 'يرجى إدخال اسم الشركة' }]}
        >
          <Input placeholder="مثال: سابك" />
        </Form.Item>

        <Form.Item
          name="industry"
          label="الصناعة / القطاع"
          rules={[{ required: true, message: 'يرجى إدخال مجال الشركة' }]}
        >
          <Input placeholder="مثال: بتروكيماويات" />
        </Form.Item>

        <Form.Item
          name="contactEmail"
          label="البريد الإلكتروني للتواصل"
          rules={[
            { required: true, message: 'يرجى إدخال البريد الإلكتروني' },
            { type: 'email', message: 'يرجى إدخال بريد صالح' }
          ]}
        >
          <Input placeholder="company@example.com" />
        </Form.Item>

        <Form.Item
          name="contractStatus"
          label="حالة العقد الحالي"
          rules={[{ required: true }]}
        >
          <Select>
            <Option value="active">نشط</Option>
            <Option value="pending">معلق / قيد الإجراء</Option>
            <Option value="expired">منتهي</Option>
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CompanyModal;
