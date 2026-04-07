import React from 'react';
import { 
  Modal, 
  Form, 
  Input, 
  Select, 
  message, 
  DatePicker 
} from 'antd';
import { useCreateService } from './serviceHooks';
import { useCompanies } from '../companies/companyHooks';

const { Option } = Select;

const serviceTypes = [
  'Commercial Registration Renewal',
  'Industrial License Update',
  'Chamber of Commerce Cert',
  'Baladiya License Issuance',
  'Muqeem Residence Renewal',
  'Qiwa Contract Documentation',
  'GOSI Compliance Certificate',
];

const NewRequestModal = ({ isOpen, onClose }) => {
  const [form] = Form.useForm();
  const { data: companies } = useCompanies();
  const createMutation = useCreateService();

  const onFinish = async (values) => {
    try {
      // Find company name from id
      const selectedCompany = companies?.find(c => c.id === values.companyId);
      
      const payload = {
        ...values,
        companyName: selectedCompany?.name || 'Unknown',
        govId: values.govId || `REQ-${Math.floor(Math.random() * 1000000)}`,
        requestDate: values.requestDate?.format('YYYY-MM-DD')
      };

      await createMutation.mutateAsync(payload);
      message.success('تم إنشاء طلب الخدمة بنجاح');
      form.resetFields();
      onClose();
    } catch (error) {
      message.error('فشل في إنشاء الطلب');
    }
  };

  return (
    <Modal
      title="فتح طلب خدمة حكومية جديدة"
      open={isOpen}
      onCancel={onClose}
      onOk={() => form.submit()}
      confirmLoading={createMutation.isPending}
      okText="إنشاء الطلب"
      cancelText="إلغاء"
      width={700}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        style={{ marginTop: 24 }}
      >
        <Form.Item
          name="companyId"
          label="الشركة المستفيدة"
          rules={[{ required: true, message: 'يرجى اختيار الشركة' }]}
        >
          <Select 
            placeholder="اختر الشركة من القائمة..." 
            showSearch
            optionFilterProp="children"
          >
            {companies?.map(c => (
              <Option key={c.id} value={c.id}>{c.name}</Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="serviceType"
          label="نوع الخدمة المطلوبة"
          rules={[{ required: true, message: 'يرجى اختيار نوع الخدمة' }]}
        >
          <Select placeholder="اختر نوع الخدمة...">
            {serviceTypes.map(type => (
              <Option key={type} value={type}>{type}</Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="govId"
          label="رقم المعاملة / الطلب (اختياري)"
        >
          <Input placeholder="مثال: CR-XXXXXX" />
        </Form.Item>

        <Form.Item
          name="requestDate"
          label="تاريخ الطلب المفضل"
        >
          <DatePicker style={{ width: '100%' }} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default NewRequestModal;
