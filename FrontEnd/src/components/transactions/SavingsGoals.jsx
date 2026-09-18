import { useState } from 'react';
import { Progress, Button, InputNumber, Input, Modal, Popover, Popconfirm, message } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faPlus, faLaptop, faPlane, faShirt, faWandMagicSparkles, faPenToSquare, faTrash } from '@fortawesome/free-solid-svg-icons';
import { createTransaction } from '../../helpers/transactionApi';

const INITIAL_GOALS = [
  { id: '1', title: '🌸 Soft Girl Emergency Cushion', target: 5000, saved: 2800, icon: faHeart, color: '#ec4899', bg: 'rgba(236, 72, 153, 0.15)' },
  { id: '2', title: '💻 Rose Gold Macbook Setup', target: 2400, saved: 1500, icon: faLaptop, color: '#a855f7', bg: 'rgba(168, 85, 247, 0.15)' },
  { id: '3', title: '✈️ Paris & Bali Vacation Wishlist', target: 1800, saved: 600, icon: faPlane, color: '#3b82f6', bg: 'rgba(59, 130, 246, 0.15)' },
  { id: '4', title: '🛍️ Designer Dream Wardrobe', target: 800, saved: 500, icon: faShirt, color: '#f43f5e', bg: 'rgba(244, 63, 94, 0.15)' }
];

const SavingsGoals = ({ onSuccess, isDarkMode = false }) => {
  const [goals, setGoals] = useState(INITIAL_GOALS);
  const [depositAmount, setDepositAmount] = useState(100);
  
  // Edit / Add Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState(null);
  const [formTitle, setFormTitle] = useState('');
  const [formTarget, setFormTarget] = useState(1000);
  const [formSaved, setFormSaved] = useState(0);

  const handleDeposit = async (goalId, goalTitle) => {
    if (!depositAmount || depositAmount <= 0) {
      message.warning('Please enter a valid deposit amount');
      return;
    }

    try {
      setGoals(prev =>
        prev.map(g => (g.id === goalId ? { ...g, saved: Math.min(g.target, g.saved + depositAmount) } : g))
      );

      await createTransaction({
        type: 'expense',
        amount: depositAmount,
        category: 'Investment',
        description: `Goal Deposit: ${goalTitle}`,
        date: new Date().toISOString()
      });

      message.success(`Deposited $${depositAmount} towards ${goalTitle}! ✨`);
      if (onSuccess) onSuccess();
    } catch (err) {
      message.error('Failed to log goal deposit');
    }
  };

  const handleOpenAddModal = () => {
    setEditingGoal(null);
    setFormTitle('');
    setFormTarget(1000);
    setFormSaved(0);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = goal => {
    setEditingGoal(goal);
    setFormTitle(goal.title);
    setFormTarget(goal.target);
    setFormSaved(goal.saved);
    setIsModalOpen(true);
  };

  const handleSaveGoal = () => {
    if (!formTitle.trim()) {
      message.warning('Goal title is required');
      return;
    }

    if (editingGoal) {
      setGoals(prev =>
        prev.map(g =>
          g.id === editingGoal.id
            ? { ...g, title: formTitle, target: Number(formTarget), saved: Number(formSaved) }
            : g
        )
      );
      message.success('Goal updated successfully! ✨');
    } else {
      const newGoal = {
        id: String(Date.now()),
        title: formTitle,
        target: Number(formTarget),
        saved: Number(formSaved),
        icon: faHeart,
        color: '#ec4899',
        bg: 'rgba(236, 72, 153, 0.15)'
      };
      setGoals(prev => [...prev, newGoal]);
      message.success('New wishlist goal created! 🌸');
    }
    setIsModalOpen(false);
  };

  const handleDeleteGoal = goalId => {
    setGoals(prev => prev.filter(g => g.id !== goalId));
    message.success('Goal removed');
  };

  return (
    <div className={`p-6 rounded-3xl border transition-colors duration-300 ${
      isDarkMode
        ? 'bg-[#240c1e] border-pink-900/40 shadow-xl'
        : 'bg-white border-pink-100 shadow-sm'
    }`}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-pink-100 dark:border-pink-900/40">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-pink-500/15 text-pink-500 flex items-center justify-center text-lg shadow-inner border border-pink-500/30">
            <FontAwesomeIcon icon={faWandMagicSparkles} />
          </div>
          <div>
            <span className={`font-black text-lg block tracking-tight ${isDarkMode ? 'text-pink-100' : 'text-slate-900'}`}>
              Girls' Dream Savings Vault Goals 💖
            </span>
            <span className={`text-xs font-semibold ${isDarkMode ? 'text-pink-300/70' : 'text-pink-600/70'}`}>
              Track your dream wishlists & fund your future era
            </span>
          </div>
        </div>

        <Button
          type="primary"
          onClick={handleOpenAddModal}
          icon={<FontAwesomeIcon icon={faPlus} />}
          className="bg-pink-600 hover:bg-pink-700 font-extrabold rounded-2xl border-0 text-xs h-9 px-4"
        >
          + Add Wishlist Goal
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {goals.map(goal => {
          const percent = Math.min(100, Math.round((goal.saved / goal.target) * 100));

          const popoverContent = (
            <div className="p-2 space-y-2 w-52">
              <span className="font-black text-xs block text-slate-700">Deposit Amount ($)</span>
              <InputNumber
                className="w-full rounded-xl"
                value={depositAmount}
                onChange={val => setDepositAmount(val || 50)}
                min={10}
                step={50}
                prefix="$"
              />
              <Button
                type="primary"
                size="small"
                onClick={() => handleDeposit(goal.id, goal.title)}
                className="w-full bg-pink-600 hover:bg-pink-700 font-extrabold rounded-xl mt-1 border-0"
              >
                Confirm Deposit ✨
              </Button>
            </div>
          );

          return (
            <div
              key={goal.id}
              className={`p-4.5 rounded-2xl border transition-all ${
                isDarkMode
                  ? 'bg-[#1a0814] border-pink-900/40 hover:border-pink-500/40'
                  : 'bg-pink-50/40 border-pink-100 hover:border-pink-200'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-2xl flex items-center justify-center text-base shadow-xs"
                    style={{ backgroundColor: goal.bg, color: goal.color }}
                  >
                    <FontAwesomeIcon icon={goal.icon} />
                  </div>
                  <div>
                    <span className={`font-black text-sm block ${isDarkMode ? 'text-pink-100' : 'text-slate-900'}`}>{goal.title}</span>
                    <span className="text-xs font-bold text-pink-400/80">
                      ${goal.saved.toLocaleString()} of ${goal.target.toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <Popover content={popoverContent} title="Add Funds ✨" trigger="click" placement="topRight">
                    <Button
                      type="text"
                      size="small"
                      icon={<FontAwesomeIcon icon={faPlus} />}
                      className="rounded-xl font-black bg-pink-500/15 text-pink-400 hover:bg-pink-500/25 px-2.5 py-1 text-xs"
                    >
                      Deposit
                    </Button>
                  </Popover>

                  <Button
                    type="text"
                    size="small"
                    icon={<FontAwesomeIcon icon={faPenToSquare} />}
                    onClick={() => handleOpenEditModal(goal)}
                    className="text-pink-500 hover:bg-pink-500/20 rounded-xl px-2 py-1 text-xs"
                    title="Edit Goal"
                  />

                  <Popconfirm
                    title="Delete wishlist goal?"
                    onConfirm={() => handleDeleteGoal(goal.id)}
                    okText="Yes, Delete"
                    cancelText="Cancel"
                    okButtonProps={{ danger: true }}
                  >
                    <Button
                      type="text"
                      size="small"
                      danger
                      icon={<FontAwesomeIcon icon={faTrash} />}
                      className="text-rose-500 hover:bg-rose-500/20 rounded-xl px-2 py-1 text-xs"
                      title="Delete Goal"
                    />
                  </Popconfirm>
                </div>
              </div>

              <Progress percent={percent} strokeColor={goal.color} trailColor={isDarkMode ? '#3b1132' : '#fce7f3'} size="small" />
            </div>
          );
        })}
      </div>

      {/* Goal Edit / Add Modal */}
      <Modal
        title={<span className="font-black text-lg text-slate-900">{editingGoal ? '✏️ Edit Wishlist Goal' : '💖 Add New Wishlist Goal'}</span>}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={handleSaveGoal}
        okText={editingGoal ? 'Update Goal' : 'Create Goal'}
        okButtonProps={{ className: 'bg-pink-600 font-bold rounded-xl border-0' }}
      >
        <div className="space-y-4 py-2">
          <div>
            <label className="block text-xs font-black text-slate-700 mb-1">Goal Title</label>
            <Input
              value={formTitle}
              onChange={e => setFormTitle(e.target.value)}
              placeholder="e.g. MacBook Pro, Trip to Tokyo..."
              className="rounded-xl"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-black text-slate-700 mb-1">Target Amount ($)</label>
              <InputNumber
                value={formTarget}
                onChange={val => setFormTarget(val || 100)}
                min={10}
                className="w-full rounded-xl"
                prefix="$"
              />
            </div>
            <div>
              <label className="block text-xs font-black text-slate-700 mb-1">Current Saved ($)</label>
              <InputNumber
                value={formSaved}
                onChange={val => setFormSaved(val || 0)}
                min={0}
                className="w-full rounded-xl"
                prefix="$"
              />
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default SavingsGoals;
