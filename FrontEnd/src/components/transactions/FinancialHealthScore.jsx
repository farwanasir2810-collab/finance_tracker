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
    grade = { text: 'B Good', color: '#3b82f6', tagColor: 'blue', icon: faShieldHeart, advice: 'Healthy cash flow. Keep maintaining consistent tracking & goal deposits.' };
  }

  // Monthly Forecast Calculations
  const daysInMonth = dayjs().daysInMonth();
  const currentDay = dayjs().date();
  const dailyBurnRate = currentDay > 0 ? totalExpenses / currentDay : 0;
  const projectedMonthExpense = Math.round(dailyBurnRate * daysInMonth);
  const projectedEndBalance = Math.round(totalIncome - projectedMonthExpense);

  return (
    <div className={`p-6 rounded-3xl border transition-colors duration-300 mb-6 ${
      isDarkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200/90 shadow-sm'
    }`}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-teal-500/10 text-teal-400 flex items-center justify-center text-lg shadow-inner border border-teal-500/20">
            <FontAwesomeIcon icon={faHeartPulse} />
          </div>
          <div>
            <span className={`font-black text-lg block tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
              Financial Health Rating & Forecasting
            </span>
            <span className={`text-xs font-semibold ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
              Algorithmic credit & cash flow burn rate prediction
            </span>
          </div>
        </div>

        <Tag color={grade.tagColor} className="m-0 font-black px-3.5 py-1.5 rounded-xl text-xs border border-white/10 shadow-xs inline-flex items-center gap-1.5">
          <FontAwesomeIcon icon={grade.icon} />
          {grade.text} ({healthScore}/100)
        </Tag>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
        
        {/* Health Meter Ring */}
        <div className={`p-5 rounded-2xl border text-center flex flex-col items-center justify-center ${
          isDarkMode ? 'bg-slate-800/50 border-slate-700/60' : 'bg-slate-50 border-slate-100'
        }`}>
          <span className={`text-xs font-black uppercase tracking-wider mb-3 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
            Financial Stability Score
          </span>
          <Progress
            type="dashboard"
            percent={healthScore}
            strokeColor={grade.color}
            trailColor={isDarkMode ? '#1e293b' : '#e2e8f0'}
            strokeWidth={10}
            size={130}
            format={percent => (
              <div className="text-center">
                <span className={`text-2xl font-black block ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{percent}</span>
                <span className="text-[10px] font-bold text-slate-400 uppercase">INDEX</span>
              </div>
            )}
          />
          <span className="text-xs font-extrabold text-slate-400 mt-2">{grade.advice}</span>
        </div>

        {/* Daily Burn Rate & Forecast */}
        <div className={`p-5 rounded-2xl border space-y-4 col-span-2 ${
          isDarkMode ? 'bg-slate-800/50 border-slate-700/60' : 'bg-slate-50 border-slate-100'
        }`}>
          <div className="flex items-center gap-2 text-xs font-black text-blue-400 uppercase tracking-wider">
            <FontAwesomeIcon icon={faChartLine} />
            Smart Cash Flow Predictions
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className={`p-3.5 rounded-xl border ${isDarkMode ? 'bg-slate-900/70 border-slate-800' : 'bg-white border-slate-200'}`}>
              <span className="text-slate-400 text-xs font-semibold block mb-1">Average Daily Spend</span>
              <span className={`text-xl font-black ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                ${dailyBurnRate.toFixed(2)} <span className="text-xs font-medium text-slate-400">/ day</span>
              </span>
            </div>

            <div className={`p-3.5 rounded-xl border ${isDarkMode ? 'bg-slate-900/70 border-slate-800' : 'bg-white border-slate-200'}`}>
              <span className="text-slate-400 text-xs font-semibold block mb-1">Projected EOM Expenses</span>
              <span className="text-xl font-black text-rose-400">
                ${projectedMonthExpense.toLocaleString()}
              </span>
            </div>
          </div>

          <div className={`p-3.5 rounded-xl border flex items-center justify-between ${
            projectedEndBalance >= 0
              ? isDarkMode ? 'bg-emerald-950/30 border-emerald-900/50 text-emerald-400' : 'bg-emerald-50 border-emerald-200 text-emerald-800'
              : isDarkMode ? 'bg-rose-950/30 border-rose-900/50 text-rose-400' : 'bg-rose-50 border-rose-200 text-rose-800'
          }`}>
            <div className="flex items-center gap-2 text-xs font-bold">
              <FontAwesomeIcon icon={faClock} />
              <span>Projected Month-End Vault Surplus:</span>
            </div>
            <span className="font-black text-sm">
              {projectedEndBalance >= 0 ? `+$${projectedEndBalance.toLocaleString()}` : `-$${Math.abs(projectedEndBalance).toLocaleString()}`}
            </span>
          </div>
        </div>

      </div>
    </div>
  );
};

export default FinancialHealthScore;
