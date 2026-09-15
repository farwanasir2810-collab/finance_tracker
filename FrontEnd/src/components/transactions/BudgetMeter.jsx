import { useState } from 'react';
import { Progress, InputNumber, Tag, Popover, Button } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBullseye, faGear, faShieldHalved, faTriangleExclamation, faCircleExclamation } from '@fortawesome/free-solid-svg-icons';

const BudgetMeter = ({ totalExpenses = 0, isDarkMode = false }) => {
  const [budgetLimit, setBudgetLimit] = useState(1500);

  const spentPercent = budgetLimit > 0 ? Math.min(100, Math.round((totalExpenses / budgetLimit) * 100)) : 0;
  const remainingBudget = budgetLimit - totalExpenses;

  let statusColor = '#10b981';
  let statusText = 'Safe & On Track';
  let statusTagColor = 'emerald';
  let statusIcon = faShieldHalved;

  if (spentPercent >= 100) {
    statusColor = '#f43f5e';
    statusText = 'Over Budget Limit!';
    statusTagColor = 'rose';
    statusIcon = faCircleExclamation;
  } else if (spentPercent >= 75) {
    statusColor = '#f59e0b';
    statusText = 'Budget Caution';
    statusTagColor = 'amber';
    statusIcon = faTriangleExclamation;
  }

  const budgetSettingsContent = (
    <div className="p-2 space-y-2 w-56">
      <span className="font-extrabold text-slate-800 text-xs block">Set Monthly Target Limit ($)</span>
      <InputNumber
        className="w-full rounded-xl"
        value={budgetLimit}
        onChange={val => setBudgetLimit(val || 1000)}
        min={100}
        step={100}
        prefix="$"
        size="middle"
      />
    </div>
  );

  return (
    <div className={`p-5 rounded-3xl border transition-colors duration-300 h-full flex flex-col justify-between ${
      isDarkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200/90 shadow-sm'
    }`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-2xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center text-base shadow-inner border border-indigo-500/20">
            <FontAwesomeIcon icon={faBullseye} />
          </div>
          <div>
            <span className={`font-black text-sm block ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
              Monthly Budget Target Goal
            </span>
            <Tag color={statusTagColor} className="m-0 font-extrabold px-2.5 py-0.5 rounded-lg border-0 text-xs mt-0.5">
              <FontAwesomeIcon icon={statusIcon} className="mr-1" />
              {statusText}
            </Tag>
          </div>
        </div>

        <Popover content={budgetSettingsContent} title="Budget Settings" trigger="click" placement="bottomRight">
          <Button type="text" size="middle" icon={<FontAwesomeIcon icon={faGear} className="text-slate-400 hover:text-slate-600" />} title="Adjust Target" />
        </Popover>
      </div>

      <div className="space-y-2 mt-2">
        <div className="flex items-baseline justify-between text-xs font-semibold">
          <span className={isDarkMode ? 'text-slate-400' : 'text-slate-500'}>
            Spent: <strong className={isDarkMode ? 'text-white font-black' : 'text-slate-900 font-black'}>${Number(totalExpenses).toLocaleString('en-US', { minimumFractionDigits: 2 })}</strong> of ${budgetLimit.toLocaleString()}
          </span>
          <span className={`font-black ${remainingBudget >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
            {remainingBudget >= 0 ? `$${remainingBudget.toLocaleString()} left` : `$${Math.abs(remainingBudget).toLocaleString()} over`}
          </span>
        </div>

        <Progress
          percent={spentPercent}
          strokeColor={statusColor}
          trailColor={isDarkMode ? '#1e293b' : '#e2e8f0'}
          size="medium"
        />
      </div>
    </div>
  );
};

export default BudgetMeter;
