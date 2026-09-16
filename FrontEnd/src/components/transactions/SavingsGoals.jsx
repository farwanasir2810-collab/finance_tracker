import { useState } from 'react';
import { Progress, Button, InputNumber, Popover, message } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faPlus, faLaptop, faPlane, faShirt, faWandMagicSparkles } from '@fortawesome/free-solid-svg-icons';
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

  return (
    <div className={`p-6 rounded-3xl border transition-colors duration-300 ${
      isDarkMode
        ? 'bg-[#240c1e] border-pink-900/40 shadow-xl'
        : 'bg-white border-pink-100 shadow-sm'
    }`}>
      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-pink-100 dark:border-pink-900/40">
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

                <Popover content={popoverContent} title="Add Funds ✨" trigger="click" placement="topRight">
                  <Button
                    type="text"
                    size="small"
                    icon={<FontAwesomeIcon icon={faPlus} />}
                    className="rounded-xl font-black bg-pink-500/15 text-pink-400 hover:bg-pink-500/25 px-3 py-1"
                  >
                    Deposit
                  </Button>
                </Popover>
              </div>

              <Progress percent={percent} strokeColor={goal.color} trailColor={isDarkMode ? '#3b1132' : '#fce7f3'} size="small" />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SavingsGoals;
