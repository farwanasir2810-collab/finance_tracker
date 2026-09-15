import { useEffect } from 'react';
import { Modal, Form, Input, InputNumber, Radio, DatePicker, Select } from 'antd';
import dayjs from 'dayjs';

const { Option } = Select;

const CATEGORIES = {
  income: ['Salary', 'Freelance', 'Investment', 'Business', 'Other Income'],
  expense: ['Groceries', 'Housing', 'Utilities', 'Transport', 'Food', 'Entertainment', 'Healthcare', 'Other Expense']
};

const TransactionModal = ({ open, onCancel, onSubmit, initialValues, loading }) => {
  const [form] = Form.useForm();
  const selectedType = Form.useWatch('type', form) || 'expense';

  useEffect(() => {
    if (open) {
      if (initialValues) {
        form.setFieldsValue({
          type: initialValues.type,
          amount: initialValues.amount,
          category: initialValues.category,
          description: initialValues.description,
          date: initialValues.date ? dayjs(initialValues.date) : dayjs()
        });
      } else {
        form.resetFields();
        form.setFieldsValue({
          type: 'expense',
          date: dayjs()
        });
      }
    }
  }, [open, initialValues, form]);

  const handleFinish = values => {
    const formattedData = {
      ...values,
      date: values.date ? values.date.toISOString() : new Date().toISOString()
    };
    onSubmit(formattedData);
  };

  return (
    <Modal
      title={
        <span className="font-extrabold text-slate-900 text-lg">
          {initialValues ? '✏️ Edit Transaction' : '➕ Add New Transaction'}
        </span>
      }
      open={open}
      onCancel={onCancel}
      onOk={() => form.submit()}
      confirmLoading={loading}
      okText={initialValues ? 'Update Record' : 'Create Record'}
      okButtonProps={{ className: 'bg-blue-600 font-bold rounded-xl' }}
      cancelButtonProps={{ className: 'rounded-xl font-bold' }}
      destroyOnClose
    >
      <Form form={form} layout="vertical" onFinish={handleFinish} className="py-2 space-y-3">
        {/* Type Radio */}
        <Form.Item name="type" label={<span className="font-bold text-slate-700">Transaction Type</span>} rules={[{ required: true }]}>
          <Radio.Group buttonStyle="solid" className="w-full grid grid-cols-2 text-center">
            <Radio.Button value="income" className="font-extrabold text-emerald-700">
              💰 Income
            </Radio.Button>
            <Radio.Button value="expense" className="font-extrabold text-rose-700">
              💸 Expense
            </Radio.Button>
          </Radio.Group>
        </Form.Item>

        {/* Amount */}
        <Form.Item
          name="amount"
          label={<span className="font-bold text-slate-700">Amount ($)</span>}
          rules={[
            { required: true, message: 'Please enter amount' },
            { type: 'number', min: 0.01, message: 'Amount must be greater than 0' }
          ]}
        >
          <InputNumber className="w-full rounded-xl" size="large" prefix="$" precision={2} placeholder="0.00" min={0.01} />
        </Form.Item>

        {/* Category */}
        <Form.Item name="category" label={<span className="font-bold text-slate-700">Category</span>} rules={[{ required: true, message: 'Please select category' }]}>
          <Select size="large" className="rounded-xl" placeholder="Select category">
            {CATEGORIES[selectedType].map(cat => (
              <Option key={cat} value={cat}>
                {cat}
              </Option>
            ))}
          </Select>
        </Form.Item>

        {/* Date */}
        <Form.Item name="date" label={<span className="font-bold text-slate-700">Transaction Date</span>} rules={[{ required: true, message: 'Please select date' }]}>
          <DatePicker size="large" className="w-full rounded-xl" format="YYYY-MM-DD" />
        </Form.Item>

        {/* Description */}
        <Form.Item name="description" label={<span className="font-bold text-slate-700">Description / Notes</span>}>
          <Input.TextArea rows={2} className="rounded-xl" placeholder="e.g. Monthly salary payout or groceries purchase" maxLength={200} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default TransactionModal;
