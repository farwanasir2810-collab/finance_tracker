import { useState } from 'react';
import { Button, Tag, Input, InputNumber, Modal, Popconfirm, message } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRepeat, faTv, faCloud, faMusic, faDumbbell, faWifi, faCreditCard, faCheck, faPenToSquare, faTrash, faPlus } from '@fortawesome/free-solid-svg-icons';
import { createTransaction } from '../../helpers/transactionApi';

const INITIAL_SUBSCRIPTIONS = [
  { id: '1', name: 'Netflix Premium 4K', cost: 19.99, cycle: 'Monthly', icon: faTv, color: '#f43f5e', bg: 'rgba(244, 63, 94, 0.15)', category: 'Entertainment' },
  { id: '2', name: 'Cloud Hosting (AWS)', cost: 45.00, cycle: 'Monthly', icon: faCloud, color: '#3b82f6', bg: 'rgba(59, 130, 246, 0.15)', category: 'Utilities' },
  { id: '3', name: 'Spotify Duo', cost: 14.99, cycle: 'Monthly', icon: faMusic, color: '#10b981', bg: 'rgba(16, 185, 129, 0.15)', category: 'Entertainment' },
  { id: '4', name: 'Fitness Gym Pass', cost: 35.00, cycle: 'Monthly', icon: faDumbbell, color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.15)', category: 'Healthcare' },
  { id: '5', name: 'High-Speed Fiber Net', cost: 60.00, cycle: 'Monthly', icon: faWifi, color: '#8b5cf6', bg: 'rgba(139, 92, 246, 0.15)', category: 'Utilities' }
];

const RecurringSubscriptions = ({ onSuccess, isDarkMode = false }) => {
  const [subscriptions, setSubscriptions] = useState(INITIAL_SUBSCRIPTIONS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSub, setEditingSub] = useState(null);
  const [formName, setFormName] = useState('');
  const [formCost, setFormCost] = useState(15);
  const [formCategory, setFormCategory] = useState('Utilities');

  const totalMonthlySub = subscriptions.reduce((acc, curr) => acc + curr.cost, 0);

  const handlePaySubscription = async sub => {
    try {
      await createTransaction({
        type: 'expense',
        amount: sub.cost,
        category: sub.category,
        description: `Subscription Payment: ${sub.name}`,
        date: new Date().toISOString()
      });

      message.success(`Logged ${sub.name} payment ($${sub.cost})!`);
      if (onSuccess) onSuccess();
    } catch (err) {
      message.error(`Failed to log ${sub.name} payment`);
    }
  };

  const handleOpenAddModal = () => {
    setEditingSub(null);
    setFormName('');
    setFormCost(15);
    setFormCategory('Utilities');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = sub => {
    setEditingSub(sub);
    setFormName(sub.name);
    setFormCost(sub.cost);
    setFormCategory(sub.category || 'Utilities');
    setIsModalOpen(true);
  };

  const handleSaveSub = () => {
    if (!formName.trim()) {
      message.warning('Subscription name is required');
      return;
    }

    if (editingSub) {
      setSubscriptions(prev =>
        prev.map(s =>
          s.id === editingSub.id
            ? { ...s, name: formName, cost: Number(formCost), category: formCategory }
            : s
        )
      );
      message.success('Subscription updated! ✨');
    } else {
      const newSub = {
        id: String(Date.now()),
        name: formName,
        cost: Number(formCost),
        cycle: 'Monthly',
        icon: faRepeat,
        color: '#ec4899',
        bg: 'rgba(236, 72, 153, 0.15)',
        category: formCategory
      };
      setSubscriptions(prev => [...prev, newSub]);
      message.success('New subscription added! 🔄');
    }
    setIsModalOpen(false);
  };

  const handleDeleteSub = subId => {
    setSubscriptions(prev => prev.filter(s => s.id !== subId));
    message.success('Subscription removed');
  };

  return (
    <div className={`p-6 rounded-3xl border transition-colors duration-300 ${
      isDarkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200/90 shadow-sm'
    }`}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-rose-500/10 text-rose-400 flex items-center justify-center text-lg shadow-inner border border-rose-500/20">
            <FontAwesomeIcon icon={faRepeat} />
          </div>
          <div>
            <span className={`font-black text-lg block tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
              Recurring Subscriptions & Fixed Bills
            </span>
            <span className={`text-xs font-semibold ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
              Manage monthly fixed commitment burdens
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Tag color="purple" className="m-0 font-black px-3.5 py-1.5 rounded-xl text-xs border border-purple-500/30 bg-purple-500/10 text-purple-400">
            <FontAwesomeIcon icon={faCreditCard} className="mr-1.5" />
            Burden: ${totalMonthlySub.toFixed(2)} / month
          </Tag>

          <Button
            type="primary"
            size="small"
            icon={<FontAwesomeIcon icon={faPlus} />}
            onClick={handleOpenAddModal}
            className="bg-purple-600 hover:bg-purple-700 font-extrabold rounded-xl border-0 text-xs px-3 py-1"
          >
            + Add Bill
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {subscriptions.map(sub => (
          <div
            key={sub.id}
            className={`p-4 rounded-2xl border flex items-center justify-between transition-all ${
              isDarkMode ? 'bg-slate-800/60 border-slate-700/60 hover:border-slate-600' : 'bg-slate-50 border-slate-100 hover:border-slate-200'
            }`}
          >
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center text-base shadow-xs"
                style={{ backgroundColor: sub.bg, color: sub.color }}
              >
                <FontAwesomeIcon icon={sub.icon} />
              </div>
              <div>
                <span className={`font-black text-sm block ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{sub.name}</span>
                <span className="text-xs font-extrabold text-slate-400">${sub.cost.toFixed(2)} / month</span>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <Button
                type="text"
                size="small"
                icon={<FontAwesomeIcon icon={faCheck} />}
                onClick={() => handlePaySubscription(sub)}
                className="rounded-xl font-black bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 px-2.5 py-1 text-xs"
                title="Log bill payment"
              >
                Log
              </Button>

              <Button
                type="text"
                size="small"
                icon={<FontAwesomeIcon icon={faPenToSquare} />}
                onClick={() => handleOpenEditModal(sub)}
                className="text-purple-400 hover:bg-purple-500/20 rounded-xl px-2 py-1 text-xs"
                title="Edit Subscription"
              />

              <Popconfirm
                title="Delete subscription?"
                onConfirm={() => handleDeleteSub(sub.id)}
                okText="Yes, Delete"
                cancelText="Cancel"
                okButtonProps={{ danger: true }}
              >
                <Button
                  type="text"
                  size="small"
                  danger
                  icon={<FontAwesomeIcon icon={faTrash} />}
                  className="text-rose-400 hover:bg-rose-500/20 rounded-xl px-2 py-1 text-xs"
                  title="Delete Subscription"
                />
              </Popconfirm>
            </div>
          </div>
        ))}
      </div>

      {/* Subscription Edit / Add Modal */}
      <Modal
        title={<span className="font-black text-lg text-slate-900">{editingSub ? '✏️ Edit Subscription' : '🔄 Add New Subscription'}</span>}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={handleSaveSub}
        okText={editingSub ? 'Update Bill' : 'Create Bill'}
        okButtonProps={{ className: 'bg-purple-600 font-bold rounded-xl border-0' }}
      >
        <div className="space-y-4 py-2">
          <div>
            <label className="block text-xs font-black text-slate-700 mb-1">Subscription / Bill Name</label>
            <Input
              value={formName}
              onChange={e => setFormName(e.target.value)}
              placeholder="e.g. Netflix, Gym Pass, Electric Bill..."
              className="rounded-xl"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-black text-slate-700 mb-1">Monthly Cost ($)</label>
              <InputNumber
                value={formCost}
                onChange={val => setFormCost(val || 10)}
                min={1}
                className="w-full rounded-xl"
                prefix="$"
              />
            </div>
            <div>
              <label className="block text-xs font-black text-slate-700 mb-1">Category</label>
              <Input
                value={formCategory}
                onChange={e => setFormCategory(e.target.value)}
                placeholder="Entertainment, Utilities..."
                className="rounded-xl"
              />
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default RecurringSubscriptions;
