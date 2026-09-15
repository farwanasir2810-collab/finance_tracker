import { useState } from 'react';
import { Progress, Button, InputNumber, Popover, message } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPiggyBank, faPlus, faBullseye, faLaptop, faPlane, faShield, faGraduationCap } from '@fortawesome/free-solid-svg-icons';
import { createTransaction } from '../../helpers/transactionApi';

const INITIAL_GOALS = [
  { id: '1', title: 'Emergency Fund', target: 5000, saved: 2800, icon: faShield, color: '#10b981', bg: 'rgba(16, 185, 129, 0.15)' },
  { id: '2', title: 'New Macbook Pro', target: 2400, saved: 1500, icon: faLaptop, color: '#3b82f6', bg: 'rgba(59, 130, 246, 0.15)' },
  { id: '3', title: 'Summer Vacation', target: 1800, saved: 600, icon: faPlane, color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.15)' },
  { id: '4', title: 'Course Certification', target: 500, saved: 350, icon: faGraduationCap, color: '#a855f7', bg: 'rgba(168, 85, 247, 0.15)' }
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
      // 1. Update Goal Saved Balance locally
      setGoals(prev =>
        prev.map(g => (g.id === goalId ? { ...g, saved: Math.min(g.target, g.saved + depositAmount) } : g))
      );

      // 2. Log transaction entry as savings expense deposit
      await createTransaction({
        type: 'expense',
        amount: depositAmount,
        category: 'Investment',
        description: `Goal Deposit: ${goalTitle}`,
        date: new Date().toISOString()
      });

      message.success(`Deposited $${depositAmount} towards ${goalTitle}!`);
      if (onSuccess) onSuccess();
    } catch (err) {
      message.error('Failed to log goal deposit');
    }
  };

  return (
    <div className={`p-6 rounded-3xl border transition-colors duration-300 ${
      isDarkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200/90 shadow-sm'
    }`}>
      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100 dark:border-slate-800">
        <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center text-lg shadow-inner border border-indigo-500/20">
          <FontAwesomeIcon icon={faPiggyBank} />
        </div>
        <div>
          <span className={`font-black text-lg block tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
            Multi-Category Savings Goals Vault
          </span>
          <span className={`text-xs font-semibold ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
            Track progress towards financial targets & deposit funds
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {goals.map(goal => {
          const percent = Math.min(100, Math.round((goal.saved / goal.target) * 100));

          const popoverContent = (
            <div className="p-2 space-y-2 w-52">
              <span className="font-extrabold text-xs block text-slate-700">Deposit Amount ($)</span>
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
                className="w-full bg-blue-600 font-extrabold rounded-xl mt-1"
              >
                Confirm Deposit
              </Button>
            </div>
          );

          return (
            <div
              key={goal.id}
              className={`p-4 rounded-2xl border transition-all ${
                isDarkMode ? 'bg-slate-800/60 border-slate-700/60 hover:border-slate-600' : 'bg-slate-50 border-slate-100 hover:border-slate-200'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-base shadow-xs"
                    style={{ backgroundColor: goal.bg, color: goal.color }}
                  >
                    <FontAwesomeIcon icon={goal.icon} />
                  </div>
                  <div>
                    <span className={`font-black text-sm block ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{goal.title}</span>
                    <span className="text-xs font-semibold text-slate-400">
                      ${goal.saved.toLocaleString()} of ${goal.target.toLocaleString()}
                    </span>
                  </div>
                </div>

                <Popover content={popoverContent} title="Add Funds" trigger="click" placement="topRight">
                  <Button
                    type="text"
                    size="small"
                    icon={<FontAwesomeIcon icon={faPlus} />}
                    className="rounded-xl font-bold bg-blue-500/10 text-blue-400 hover:bg-blue-500/20"
                  >
                    Deposit
                  </Button>
                </Popover>
              </div>

              <Progress percent={percent} strokeColor={goal.color} trailColor={isDarkMode ? '#1e293b' : '#e2e8f0'} size="small" />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SavingsGoals;
