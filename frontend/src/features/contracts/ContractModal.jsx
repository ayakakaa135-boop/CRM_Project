import React from 'react';
import { 
  Modal, 
  Form, 
  Input, 
  Select, 
  message, 
  DatePicker,
  InputNumber,
  Row,
  Col
} from 'antd';
import { useSaveContract } from './contractHooks';
import { useCompanies } from '../companies/companyHooks';
import dayjs from 'dayjs';

const { Option } = Select;

const ContractModal = ({ isOpen, onClose, initialValues = null }) => {
  const [form] = Form.useForm();
  const { data: companies } = useCompanies();
  const saveMutation = useSaveContract();

  const onFinish = async (values) => {
    try {
      const selectedCompany = companies?.find(c => c.id === values.companyId);
      
      const payload = {
        ...values,
        id: initialValues?.id,
        companyName: selectedCompany?.name || 'Unknown',
        startDate: values.dates[0].format('YYYY-MM-DD'),
        endDate: values.dates[1].format('YYYY-MM-DD'),
      };

      await saveMutation.mutateAsync(payload);
      message.success(initialValues ? 'تم تحديث العقد' : 'تمت إضافة العقد بنجاح');
      form.resetFields();
      onClose();
    } catch (error) {
      message.error('فشل في حفظ العقد');
    }
  };

  return (
    <Modal
      title={initialValues ? 'تعديل العقد' : 'إضافة عقد جديد'}
      open={isOpen}
      onCancel={onClose}
      onOk={() => form.submit()}
      confirmLoading={saveMutation.isPending}
      okText="حفظ العقد"
      cancelText="إلغاء"
      width={700}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        style={{ marginTop: 24 }}
        initialValues={initialValues ? {
          ...initialValues,
          dates: [dayjs(initialValues.startDate), dayjs(initialValues.endDate)]
        } : { type: 'Annual' }}
      >
        <Form.Item
          name="title"
          label="عنوان العقد / المرفق"
          rules={[{ required: true, message: 'يرجى إدخال عنوان العقد' }]}
        >
          <Input placeholder="مثال: عقد توريد ورق، اشتراك تم سنوي..." />
        </Form.Item>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="companyId"
              label="المنشأة"
              rules={[{ required: true, message: 'يرجى اختيار المنشأة' }]}
            >
              <Select placeholder="اختر المنشأة..." showSearch optionFilterProp="children">
                {companies?.map(c => (
                  <Option key={c.id} value={c.id}>{c.name}</Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="type"
              label="نوع التعاقد"
              rules={[{ required: true }]}
            >
              <Select>
                <Option value="Annual">عقد سنوي</Option>
                <Option value="Monthly">اشتراك شهري</Option>
                <Option value="Project">عقد مشروع محدد</Option>
                <Option value="Subscription">اشتراك خدمات إلكترونية</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="dates"
              label="فترة الصلاحية (من - إلى)"
              rules={[{ required: true, message: 'يرجى اختيار التواريخ' }]}
            >
              <DatePicker.RangePicker style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="value"
              label="قيمة العقد الإجمالية (بدون الضريبة)"
              rules={[{ required: true, message: 'يرجى إدخال القيمة' }]}
            >
              <InputNumber style={{ width: '100%' }} prefix="SR" min={0} />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          name="notes"
          label="شروط أو ملاحظات إضافية"
        >
          <Input.TextArea placeholder="اكتب أي ملاحظات أو شروط خاصة بالعقد..." rows={3} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ContractModal;
