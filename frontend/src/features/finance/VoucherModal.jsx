import React, { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Modal,
  Form,
  Input,
  Select,
  message,
  InputNumber,
  DatePicker,
  Row,
  Col,
  Typography,
} from 'antd';
import dayjs from 'dayjs';
import apiClient, { unwrapListResponse } from '../../api/apiClient';
import { useCreateReceiptVoucher, useCreatePaymentVoucher } from './financeHooks';

const { Text } = Typography;
const { TextArea } = Input;

const receiptPaymentMethods = [
  { value: 'cash', label: 'نقدي' },
  { value: 'bank_transfer', label: 'تحويل بنكي' },
  { value: 'cheque', label: 'شيك' },
  { value: 'other', label: 'أخرى' },
];

const paymentVoucherMethods = [
  { value: 'cash', label: 'نقدي' },
  { value: 'bank_transfer', label: 'تحويل بنكي' },
  { value: 'cheque', label: 'شيك' },
];

const paymentVoucherTypes = [
  { value: 'salary', label: 'راتب' },
  { value: 'commission', label: 'عمولة' },
  { value: 'expense', label: 'مصاريف تشغيلية' },
  { value: 'other', label: 'أخرى' },
];

const VoucherModal = ({ open, onClose, mode = 'receipt' }) => {
  const [form] = Form.useForm();
  const isReceipt = mode === 'receipt';
  const createReceiptMutation = useCreateReceiptVoucher();
  const createPaymentMutation = useCreatePaymentVoucher();

  const { data: companies = [], isLoading: loadingCompanies } = useQuery({
    queryKey: ['voucherCompanies'],
    enabled: open && isReceipt,
    queryFn: async () => {
      const { data } = await apiClient.get('/companies/');
      return unwrapListResponse(data);
    },
  });

  const { data: staff = [], isLoading: loadingStaff } = useQuery({
    queryKey: ['staff'],
    enabled: open && !isReceipt,
    queryFn: async () => {
      const { data } = await apiClient.get('/auth/users/');
      return unwrapListResponse(data).filter((user) => user.is_active);
    },
  });

  useEffect(() => {
    if (!open) {
      return;
    }

    form.resetFields();
    form.setFieldsValue({
      date: dayjs(),
      payment_method: 'bank_transfer',
      voucher_type: 'expense',
    });
  }, [form, open, isReceipt]);

  const handleSubmit = async (values) => {
    try {
      const payload = {
        ...values,
        date: values.date.format('YYYY-MM-DD'),
        amount: Number(values.amount),
        reference: values.reference?.trim() || '',
        notes: values.notes?.trim() || '',
      };

      if (isReceipt) {
        await createReceiptMutation.mutateAsync(payload);
        message.success('تم إنشاء سند القبض بنجاح');
      } else {
        await createPaymentMutation.mutateAsync(payload);
        message.success('تم إنشاء سند الصرف بنجاح');
      }

      form.resetFields();
      onClose();
    } catch (error) {
      const errorData = error.response?.data;
      const firstError = typeof errorData === 'object'
        ? Object.values(errorData)[0]
        : null;
      const detail = Array.isArray(firstError) ? firstError[0] : firstError;
      message.error(detail || 'تعذر حفظ السند، يرجى التحقق من المدخلات.');
    }
  };

  return (
    <Modal
      title={isReceipt ? 'إنشاء سند قبض جديد' : 'إنشاء سند صرف جديد'}
      open={open}
      onCancel={onClose}
      onOk={() => form.submit()}
      confirmLoading={createReceiptMutation.isPending || createPaymentMutation.isPending}
      okText={isReceipt ? 'حفظ سند القبض' : 'حفظ سند الصرف'}
      cancelText="إلغاء"
      width={720}
      destroyOnClose
    >
      <Form form={form} layout="vertical" onFinish={handleSubmit} style={{ marginTop: 20 }}>
        {isReceipt ? (
          <Form.Item
            name="company"
            label="الشركة"
            rules={[{ required: true, message: 'يرجى اختيار الشركة' }]}
          >
            <Select
              placeholder="اختر الشركة المرتبطة بالسند"
              loading={loadingCompanies}
              optionFilterProp="label"
              showSearch
              options={companies.map((company) => ({
                value: company.id,
                label: company.name,
              }))}
            />
          </Form.Item>
        ) : (
          <>
            <Form.Item
              name="voucher_type"
              label="نوع السند"
              rules={[{ required: true, message: 'يرجى اختيار نوع السند' }]}
            >
              <Select options={paymentVoucherTypes} />
            </Form.Item>
            <Form.Item name="employee" label="الموظف المستلم">
              <Select
                placeholder="اختياري: اختر موظفاً أو اتركه لجهة خارجية"
                loading={loadingStaff}
                allowClear
                optionFilterProp="label"
                showSearch
                options={staff.map((user) => ({
                  value: user.id,
                  label: `${user.first_name || ''} ${user.last_name || ''}`.trim() || user.username,
                }))}
              />
            </Form.Item>
          </>
        )}

        <Row gutter={16}>
          <Col xs={24} md={12}>
            <Form.Item
              name="amount"
              label="المبلغ"
              rules={[{ required: true, message: 'يرجى إدخال المبلغ' }]}
            >
              <InputNumber
                min={1}
                precision={2}
                style={{ width: '100%' }}
                placeholder="مثال: 4500"
                addonAfter="ر.س"
              />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              name="date"
              label="التاريخ"
              rules={[{ required: true, message: 'يرجى اختيار التاريخ' }]}
            >
              <DatePicker style={{ width: '100%' }} format="YYYY-MM-DD" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col xs={24} md={12}>
            <Form.Item
              name="payment_method"
              label="طريقة الدفع"
              rules={[{ required: true, message: 'يرجى اختيار طريقة الدفع' }]}
            >
              <Select options={isReceipt ? receiptPaymentMethods : paymentVoucherMethods} />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item name="reference" label="المرجع أو الرقم الداخلي">
              <Input placeholder={isReceipt ? 'مثال: INV-2026-014' : 'مثال: PAY-2026-011'} />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item name="notes" label="ملاحظات">
          <TextArea rows={3} placeholder="أضف وصفاً مختصراً لهذا السند..." />
        </Form.Item>

        <Text type="secondary">
          {isReceipt
            ? 'سيظهر السند مباشرة في قائمة سندات القبض بعد الحفظ.'
            : 'يمكن ترك الموظف فارغاً إذا كان الصرف لجهة خارجية أو مصروف تشغيلي عام.'}
        </Text>
      </Form>
    </Modal>
  );
};

export default VoucherModal;
