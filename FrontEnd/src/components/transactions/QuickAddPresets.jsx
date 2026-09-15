import { Button, message } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faMugHot,
  faCartShopping,
  faBriefcase,
  faCar,
  faBolt,
  faBoltLightning
} from '@fortawesome/free-solid-svg-icons';
import { createTransaction } from '../../helpers/transactionApi';

const PRESETS = [
  { label: 'Coffee ($5)', type: 'expense', amount: 5, category: 'Groceries', description: 'Quick Coffee', icon: faMugHot, color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.1)' },
  { label: 'Groceries ($50)', type: 'expense', amount: 50, category: 'Groceries', description: 'Supermarket Groceries', icon: faCartShopping, color: '#eab308', bg: 'rgba(234, 179, 8, 0.1)' },
  { label: 'Gas/Transport ($30)', type: 'expense', amount: 30, category: 'Transport', description: 'Fuel / Ride', icon: faCar, color: '#3b82f6', bg: 'rgba(59, 130, 246, 0.1)' },
  { label: 'Utility Bill ($100)', type: 'expense', amount: 100, category: 'Utilities', description: 'Utility Bill Payment', icon: faBolt, color: '#a855f7', bg: 'rgba(168, 85, 247, 0.1)' },
  { label: 'Paycheck ($1,000)', type: 'income', amount: 1000, category: 'Salary', description: 'Quick Salary Deposit', icon: faBriefcase, color: '#10b981', bg: 'rgba(16, 185, 129, 0.1)' }
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
      message.success(`Logged ${preset.label} successfully!`);
      if (onSuccess) onSuccess();
    } catch (err) {
      message.error(err.response?.data?.message || 'Failed to add quick transaction');
    }
  };

  return (
    <div className={`p-5 rounded-3xl border transition-colors duration-300 h-full flex flex-col justify-between ${
      isDarkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200/90 shadow-sm'
    }`}>
      <div className="flex items-center gap-2.5 mb-3">
        <div className="w-9 h-9 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center text-base shadow-inner border border-amber-500/20">
          <FontAwesomeIcon icon={faBoltLightning} />
        </div>
        <div>
          <span className={`font-black text-sm block ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
            1-Click Quick Add Presets
          </span>
          <span className={`text-xs font-semibold ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
            Instant 1-second entry logging
          </span>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2.5 mt-1">
        {PRESETS.map((preset, index) => (
          <Button
            key={index}
            onClick={() => handleQuickAdd(preset)}
            className="rounded-2xl border-0 font-extrabold text-xs flex items-center gap-2 py-4 px-3.5 shadow-2xs hover:scale-105 transition-all"
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
