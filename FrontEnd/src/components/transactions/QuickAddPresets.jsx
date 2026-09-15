import { Card, Button, Space, message } from 'antd';
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
  { label: 'Coffee ($5)', type: 'expense', amount: 5, category: 'Groceries', description: 'Quick Coffee', icon: faMugHot, color: '#b45309', bg: '#fffbeb' },
  { label: 'Groceries ($50)', type: 'expense', amount: 50, category: 'Groceries', description: 'Supermarket Groceries', icon: faCartShopping, color: '#d97706', bg: '#fffbe6' },
  { label: 'Gas/Transport ($30)', type: 'expense', amount: 30, category: 'Transport', description: 'Fuel / Ride', icon: faCar, color: '#2563eb', bg: '#eff6ff' },
  { label: 'Utility Bill ($100)', type: 'expense', amount: 100, category: 'Utilities', description: 'Utility Bill Payment', icon: faBolt, color: '#ca8a04', bg: '#fefce8' },
  { label: 'Paycheck ($1,000)', type: 'income', amount: 1000, category: 'Salary', description: 'Quick Salary Deposit', icon: faBriefcase, color: '#059669', bg: '#ecfdf5' }
];

const QuickAddPresets = ({ onSuccess }) => {
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
    <Card bordered={false} className="shadow-sm rounded-2xl border border-slate-200/80 bg-white">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center text-xs shadow-xs">
            <FontAwesomeIcon icon={faBoltLightning} />
          </div>
          <span className="font-extrabold text-slate-800 text-sm">1-Click Quick Add Presets</span>
          <span className="text-slate-400 text-xs font-medium hidden sm:inline">(Tap to log instantly)</span>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {PRESETS.map((preset, index) => (
          <Button
            key={index}
            onClick={() => handleQuickAdd(preset)}
            className="rounded-xl border-slate-200 hover:border-slate-300 font-bold text-xs flex items-center gap-2 py-4 px-3.5 shadow-2xs hover:shadow-xs transition-all"
            style={{ backgroundColor: preset.bg, color: preset.color }}
          >
            <FontAwesomeIcon icon={preset.icon} />
            <span>{preset.label}</span>
          </Button>
        ))}
      </div>
    </Card>
  );
};

export default QuickAddPresets;
