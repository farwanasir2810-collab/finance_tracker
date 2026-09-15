import { Progress, Tag } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faHeartPulse,
  faChartLine,
  faClock,
  faShieldHeart,
  faCircleCheck,
  faTriangleExclamation
} from '@fortawesome/free-solid-svg-icons';
import dayjs from 'dayjs';

const FinancialHealthScore = ({ summary = {}, transactions = [], isDarkMode = false }) => {
  const { totalIncome = 0, totalExpenses = 0 } = summary;

  // 1. Calculate Savings Rate Score (up to 40 pts)
  const savingsRate = totalIncome > 0 ? ((totalIncome - totalExpenses) / totalIncome) * 100 : 0;
  let savingsScore = 0;
  if (savingsRate >= 30) savingsScore = 40;
  else if (savingsRate >= 15) savingsScore = 30;
  else if (savingsRate >= 0) savingsScore = 20;
  else savingsScore = 5;

  // 2. Calculate Expense Ratio Score (up to 30 pts)
  const expenseRatio = totalIncome > 0 ? (totalExpenses / totalIncome) * 100 : 100;
  let ratioScore = 0;
  if (expenseRatio <= 50) ratioScore = 30;
  else if (expenseRatio <= 75) ratioScore = 20;
  else if (expenseRatio <= 95) ratioScore = 10;
  else ratioScore = 0;

  // 3. Activity & Consistency Score (up to 30 pts)
  const activityScore = Math.min(30, transactions.length * 6);

  // Total Health Score (0 - 100)
  const healthScore = Math.min(100, Math.max(10, Math.round(savingsScore + ratioScore + activityScore)));

  // Health Grade Assignment
  let grade = { text: 'A+ Optimal', color: '#10b981', tagColor: 'emerald', icon: faCircleCheck, advice: 'Outstanding cash balance management & strong savings cushion.' };
  if (healthScore < 40) {
    grade = { text: 'D Critical', color: '#f43f5e', tagColor: 'rose', icon: faTriangleExclamation, advice: 'Expenses exceed or rival income. Consider reducing non-essential outflows.' };
  } else if (healthScore < 65) {
    grade = { text: 'C Moderate', color: '#f59e0b', tagColor: 'amber', icon: faTriangleExclamation, advice: 'Fair stability. Increase savings buffer to withstand unexpected costs.' };
  } else if (healthScore < 85) {
    grade = { text: 'B Good', color: '#2563eb', tagColor: 'blue', icon: faShieldHeart, advice: 'Healthy cash flow. Keep maintaining consistent tracking & goal deposits.' };
  }

  // Monthly Forecast Calculations
  const daysInMonth = dayjs().daysInMonth();
  const currentDay = dayjs().date();
  const dailyBurnRate = currentDay > 0 ? totalExpenses / currentDay : 0;
  const projectedMonthExpense = Math.round(dailyBurnRate * daysInMonth);
  const projectedEndBalance = Math.round(totalIncome - projectedMonthExpense);

  return (
    <div className={`p-6 rounded-2xl border transition-colors duration-200 mb-6 ${
      isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200/80 shadow-xs'
    }`}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm ${
            isDarkMode ? 'bg-teal-500/15 text-teal-400' : 'bg-teal-50 text-teal-600'
          }`}>
            <FontAwesomeIcon icon={faHeartPulse} />
          </div>
          <div>
            <h3 className={`font-extrabold text-base block ${isDarkMode ? 'text-white' : 'text-slate-900'} m-0`}>
              Financial Health & Cash Flow Forecast
            </h3>
            <span className="text-xs text-slate-400 font-medium">
              Real-time stability rating & expense burn rate modeling
            </span>
          </div>
        </div>

        <Tag color={grade.tagColor} className="m-0 font-bold px-3 py-1 rounded-lg text-xs border-0 inline-flex items-center gap-1.5">
          <FontAwesomeIcon icon={grade.icon} />
          {grade.text} ({healthScore}/100)
        </Tag>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
        
        {/* Health Gauge */}
        <div className={`p-5 rounded-xl border text-center flex flex-col items-center justify-center ${
          isDarkMode ? 'bg-slate-950/40 border-slate-800' : 'bg-slate-50 border-slate-100'
        }`}>
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
            Financial Health Index
          </span>
          <Progress
            type="dashboard"
            percent={healthScore}
            strokeColor={grade.color}
            trailColor={isDarkMode ? '#1e293b' : '#e2e8f0'}
            strokeWidth={9}
            size={120}
            format={percent => (
              <div className="text-center">
                <span className={`text-2xl font-extrabold block ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{percent}</span>
                <span className="text-[10px] font-bold text-slate-400 uppercase">SCORE</span>
              </div>
            )}
          />
          <span className="text-xs font-medium text-slate-400 mt-2 px-2">{grade.advice}</span>
        </div>

        {/* Daily Burn Rate & Forecast */}
        <div className={`p-5 rounded-xl border space-y-4 col-span-2 ${
          isDarkMode ? 'bg-slate-950/40 border-slate-800' : 'bg-slate-50 border-slate-100'
        }`}>
          <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
            <FontAwesomeIcon icon={faChartLine} className="text-blue-500" />
            Monthly Cash Flow Projection
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className={`p-3.5 rounded-lg border ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200/70'}`}>
              <span className="text-slate-400 text-xs font-medium block mb-1">Average Daily Spend</span>
              <span className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                ${dailyBurnRate.toFixed(2)} <span className="text-xs font-medium text-slate-400">/ day</span>
              </span>
            </div>

            <div className={`p-3.5 rounded-lg border ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200/70'}`}>
              <span className="text-slate-400 text-xs font-medium block mb-1">Projected EOM Outflow</span>
              <span className="text-xl font-bold text-rose-500">
                ${projectedMonthExpense.toLocaleString()}
              </span>
            </div>
          </div>

          <div className={`p-3.5 rounded-lg border flex items-center justify-between ${
            projectedEndBalance >= 0
              ? isDarkMode ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-emerald-50 border-emerald-200 text-emerald-800'
              : isDarkMode ? 'bg-rose-500/10 border-rose-500/20 text-rose-400' : 'bg-rose-50 border-rose-200 text-rose-800'
          }`}>
            <div className="flex items-center gap-2 text-xs font-medium">
              <FontAwesomeIcon icon={faClock} />
              <span>Projected Month-End Balance:</span>
            </div>
            <span className="font-extrabold text-sm">
              {projectedEndBalance >= 0 ? `+$${projectedEndBalance.toLocaleString()}` : `-$${Math.abs(projectedEndBalance).toLocaleString()}`}
            </span>
          </div>
        </div>

      </div>
    </div>
  );
};

export default FinancialHealthScore;
