import React from 'react';
import { 
  Modal, 
  Form, 
  Input, 
  Select, 
  message, 
  InputNumber,
  Radio,
  Row,
  Col,
  Typography,
} from 'antd';
import { useCreateTransaction } from './financeHooks';
import { useCompanies } from '../companies/companyHooks';

const { Option } = Select;
const { Text } = Typography;

const TransactionModal = ({ isOpen, onClose }) => {
  const [form] = Form.useForm();
  const { data: companies } = useCompanies();
  const createMutation = useCreateTransaction();

  const onFinish = async (values) => {
    try {
      const selectedCompany = companies?.find(c => c.id === values.companyId);
      
      const payload = {
        ...values,
        companyName: selectedCompany?.name || 'Unknown',
      };

      await createMutation.mutateAsync(payload);
      message.success('تم إصدار السند المالي بنجاح');
      form.resetFields();
      onClose();
    } catch (error) {
      message.error('فشل في إصدار السند');
    }
  };

  return (
    <Modal
      title="إصدار سند مالي جديد"
      open={isOpen}
      onCancel={onClose}
      onOk={() => form.submit()}
      confirmLoading={createMutation.isPending}
      okText="إصدار السند"
      cancelText="إلغاء"
      width={650}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={{ type: 'receipt', method: 'Bank Transfer' }}
        style={{ marginTop: 24 }}
      >
        <Form.Item
          name="type"
          label="نوع العملية"
          rules={[{ required: true }]}
        >
          <Radio.Group buttonStyle="solid">
            <Radio.Button value="receipt">سند قبض (إيراد)</Radio.Button>
            <Radio.Button value="payment">سند صرف (مصروف)</Radio.Button>
          </Radio.Group>
        </Form.Item>

        <Form.Item
          name="companyId"
          label="المنشأة المستهدفة"
          rules={[{ required: true, message: 'يرجى اختيار المنشأة' }]}
        >
          <Select 
            placeholder="اختر المنشأة..." 
            showSearch
            optionFilterProp="children"
          >
            {companies?.map(c => (
              <Option key={c.id} value={c.id}>{c.name}</Option>
            ))}
          </Select>
        </Form.Item>

        <Row gutter={16}>
          <Col span={14}>
            <Form.Item
              name="amount"
              label="المبلغ الأساسي (بدون الضريبة)"
              rules={[{ required: true, message: 'يرجى إدخال المبلغ' }]}
            >
              <InputNumber 
                style={{ width: '100%' }} 
                prefix="SR" 
                min={1}
                placeholder="مثال: 1000"
              />
            </Form.Item>
          </Col>
          <Col span={10}>
             <div style={{ marginTop: 32 }}>
                <Text type="secondary">+ ضريبة القيمة المضافة (15%) تُحسب آلياً</Text>
             </div>
          </Col>
        </Row>

        <Form.Item
          name="method"
          label="طريقة الدفع"
          rules={[{ required: true }]}
        >
          <Select>
            <Option value="Bank Transfer">تحويل بنكي</Option>
            <Option value="Cash">كاش / نقدي</Option>
            <Option value="Mada">مدى / شبكة</Option>
            <Option value="Cheque">شيك</Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="notes"
          label="ملاحظات إضافية (اختياري)"
        >
          <Input.TextArea placeholder="اكتب تفاصيل إضافية عن الدفعة..." rows={2} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default TransactionModal;
