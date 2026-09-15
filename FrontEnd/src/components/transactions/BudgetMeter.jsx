import { useState } from 'react';
import { Card, Progress, InputNumber, Tag, Popover, Button } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBullseye, faGear, faShieldHalved, faTriangleExclamation, faCircleExclamation } from '@fortawesome/free-solid-svg-icons';

const BudgetMeter = ({ totalExpenses = 0 }) => {
  const [budgetLimit, setBudgetLimit] = useState(1500);

  const spentPercent = budgetLimit > 0 ? Math.min(100, Math.round((totalExpenses / budgetLimit) * 100)) : 0;
  const remainingBudget = budgetLimit - totalExpenses;

  let statusColor = '#059669'; // Green
  let statusText = 'Safe & On Track';
  let statusTagColor = 'emerald';
  let statusIcon = faShieldHalved;

  if (spentPercent >= 100) {
    statusColor = '#dc2626'; // Red
    statusText = 'Over Budget Limit!';
    statusTagColor = 'rose';
    statusIcon = faCircleExclamation;
  } else if (spentPercent >= 75) {
    statusColor = '#d97706'; // Amber
    statusText = 'Budget Caution';
    statusTagColor = 'amber';
    statusIcon = faTriangleExclamation;
  }

  const budgetSettingsContent = (
    <div className="p-2 space-y-2 w-56">
      <span className="font-bold text-slate-800 text-xs block">Set Monthly Budget Limit ($)</span>
      <InputNumber
        className="w-full rounded-lg"
        value={budgetLimit}
        onChange={val => setBudgetLimit(val || 1000)}
        min={100}
        step={100}
        prefix="$"
        size="small"
      />
    </div>
  );

  return (
    <Card bordered={false} className="shadow-sm rounded-2xl border border-slate-200/80 bg-white">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center text-xs shadow-xs">
            <FontAwesomeIcon icon={faBullseye} />
          </div>
          <span className="font-extrabold text-slate-800 text-sm">Monthly Budget Goal</span>
          <Tag color={statusTagColor} className="m-0 font-bold px-2 py-0.5 rounded-full border-0 text-xs">
            <FontAwesomeIcon icon={statusIcon} className="mr-1" />
            {statusText}
          </Tag>
        </div>

        <Popover content={budgetSettingsContent} title="Budget Settings" trigger="click" placement="bottomRight">
          <Button type="text" size="small" icon={<FontAwesomeIcon icon={faGear} className="text-slate-400" />} title="Adjust Budget" />
        </Popover>
      </div>

      <div className="flex items-baseline justify-between mb-1.5">
        <span className="text-slate-600 text-xs font-semibold">
          Spent: <strong className="text-slate-900">${Number(totalExpenses).toLocaleString('en-US', { minimumFractionDigits: 2 })}</strong> of ${budgetLimit.toLocaleString()}
        </span>
        <span className={`text-xs font-bold ${remainingBudget >= 0 ? 'text-emerald-700' : 'text-rose-700'}`}>
          {remainingBudget >= 0 ? `$${remainingBudget.toLocaleString()} left` : `$${Math.abs(remainingBudget).toLocaleString()} over`}
        </span>
      </div>

      <Progress
        percent={spentPercent}
        strokeColor={statusColor}
        trailColor="#e2e8f0"
        size="small"
      />
    </Card>
  );
};

export default BudgetMeter;
