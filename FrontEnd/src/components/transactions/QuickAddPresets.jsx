import { Button, message } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faMugHot,
  faBagShopping,
  faBriefcase,
  faGem,
  faUtensils,
  faWandMagicSparkles
} from '@fortawesome/free-solid-svg-icons';
import { createTransaction } from '../../helpers/transactionApi';

const PRESETS = [
  { label: '☕ Matcha & Cafe ($5)', type: 'expense', amount: 5, category: 'Food', description: 'Cozy Cafe & Matcha', icon: faMugHot, color: '#ec4899', bg: 'rgba(236, 72, 153, 0.12)' },
  { label: '🛍️ Shopping Spree ($45)', type: 'expense', amount: 45, category: 'Groceries', description: 'Zara / Boutique Haul', icon: faBagShopping, color: '#f43f5e', bg: 'rgba(244, 63, 94, 0.12)' },
  { label: '💅 Skincare & Glow ($35)', type: 'expense', amount: 35, category: 'Healthcare', description: 'Beauty & Wellness Care', icon: faGem, color: '#a855f7', bg: 'rgba(168, 85, 247, 0.12)' },
  { label: '🍰 Bakery & Treats ($15)', type: 'expense', amount: 15, category: 'Food', description: 'Sweet Desserts & Treats', icon: faUtensils, color: '#d97706', bg: 'rgba(217, 119, 6, 0.12)' },
  { label: '💼 Paycheck Deposit ($1,200)', type: 'income', amount: 1200, category: 'Salary', description: 'Monthly Paycheck Payout', icon: faBriefcase, color: '#10b981', bg: 'rgba(16, 185, 129, 0.12)' }
];

const QuickAddPresets = ({ onSuccess, isDarkMode = false }) => {
  const handleQuickAdd = async preset => {
    try {
      await createTransaction({
        type: preset.type,
        amount: preset.amount,
        category: preset.category,
        description: preset.description,
        date: new Date().toISOString()
      });
      message.success(`Logged ${preset.label} successfully! ✨`);
      if (onSuccess) onSuccess();
    } catch (err) {
      message.error(err.response?.data?.message || 'Failed to add quick transaction');
    }
  };

  return (
    <div className={`p-6 rounded-3xl border transition-colors duration-300 h-full flex flex-col justify-between ${
      isDarkMode
        ? 'bg-[#240c1e] border-pink-900/40 shadow-xl'
        : 'bg-white border-pink-100 shadow-sm'
    }`}>
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-2xl bg-pink-500/15 text-pink-500 flex items-center justify-center text-lg shadow-inner border border-pink-500/30">
          <FontAwesomeIcon icon={faWandMagicSparkles} />
        </div>
        <div>
          <span className={`font-black text-base block ${isDarkMode ? 'text-pink-100' : 'text-slate-900'}`}>
            1-Click Aesthetic Presets 🌸
          </span>
          <span className={`text-xs font-semibold ${isDarkMode ? 'text-pink-300/70' : 'text-pink-600/70'}`}>
            Instant 1-second cute log buttons
          </span>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2.5 mt-1">
        {PRESETS.map((preset, index) => (
          <Button
            key={index}
            onClick={() => handleQuickAdd(preset)}
            className="rounded-2xl border-0 font-black text-xs flex items-center gap-2 py-4 px-4 shadow-xs hover:scale-105 transition-all"
            style={{ backgroundColor: preset.bg, color: preset.color }}
          >
            <FontAwesomeIcon icon={preset.icon} />
            <span>{preset.label}</span>
          </Button>
        ))}
      </div>
    </div>
  );
};

export default QuickAddPresets;
