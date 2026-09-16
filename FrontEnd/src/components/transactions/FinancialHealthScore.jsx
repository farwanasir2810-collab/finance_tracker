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
  let grade = { text: '🌸 A+ Optimal Queen', color: '#ec4899', tagColor: 'magenta', icon: faCircleCheck, advice: 'Outstanding cash balance management & strong savings cushion.' };
  if (healthScore < 40) {
    grade = { text: '⚠ D Critical Spending', color: '#f43f5e', tagColor: 'rose', icon: faTriangleExclamation, advice: 'Expenses exceed or rival income. Consider reducing non-essential outflows.' };
  } else if (healthScore < 65) {
    grade = { text: '💅 C Moderate Balance', color: '#f59e0b', tagColor: 'amber', icon: faTriangleExclamation, advice: 'Fair stability. Increase savings buffer to withstand unexpected costs.' };
  } else if (healthScore < 85) {
    grade = { text: '💖 B Good Cushion', color: '#a855f7', tagColor: 'purple', icon: faShieldHeart, advice: 'Healthy cash flow. Keep maintaining consistent tracking & goal deposits.' };
  }

  // Monthly Forecast Calculations
  const daysInMonth = dayjs().daysInMonth();
  const currentDay = dayjs().date();
  const dailyBurnRate = currentDay > 0 ? totalExpenses / currentDay : 0;
  const projectedMonthExpense = Math.round(dailyBurnRate * daysInMonth);
  const projectedEndBalance = Math.round(totalIncome - projectedMonthExpense);

  return (
    <div className={`p-6 rounded-3xl border transition-all duration-300 mb-6 backdrop-blur-md shadow-md ${
      isDarkMode
        ? 'bg-[#240c1e]/90 border-pink-900/40 shadow-pink-950/20'
        : 'bg-white/90 border-pink-200/70 shadow-pink-100/60'
    }`}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-pink-500 to-rose-500 text-white flex items-center justify-center text-lg shadow-md shadow-pink-500/20">
            <FontAwesomeIcon icon={faHeartPulse} />
          </div>
          <div>
            <h3 className={`font-black text-lg block ${isDarkMode ? 'text-pink-100' : 'text-slate-900'} m-0`}>
              Finora Financial Health Rating & Forecasting 🌸
            </h3>
            <span className={`text-xs font-semibold ${isDarkMode ? 'text-pink-300/70' : 'text-pink-700/80'}`}>
              Algorithmic stability index & month-end cash flow burn prediction
            </span>
          </div>
        </div>

        <Tag color={grade.tagColor} className="m-0 font-black px-3.5 py-1.5 rounded-xl text-xs border border-pink-200 shadow-2xs inline-flex items-center gap-1.5">
          <FontAwesomeIcon icon={grade.icon} />
          {grade.text} ({healthScore}/100)
        </Tag>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
        
        {/* Health Meter Ring */}
        <div className={`p-5 rounded-2xl border text-center flex flex-col items-center justify-center transition-all ${
          isDarkMode ? 'bg-[#180814] border-pink-900/30' : 'bg-pink-50/70 border-pink-200/80 shadow-xs'
        }`}>
          <span className={`text-xs font-black uppercase tracking-wider mb-3 ${isDarkMode ? 'text-pink-300' : 'text-pink-800'}`}>
            Stability Index Rating
          </span>
          <Progress
            type="dashboard"
            percent={healthScore}
            strokeColor={{ '0%': '#ec4899', '100%': '#a855f7' }}
            trailColor={isDarkMode ? '#3b1132' : '#fce7f3'}
            strokeWidth={10}
            size={130}
            format={percent => (
              <div className="text-center">
                <span className={`text-2xl font-black block ${isDarkMode ? 'text-pink-100' : 'text-slate-900'}`}>{percent}</span>
                <span className="text-[10px] font-black text-pink-500 uppercase">SCORE</span>
              </div>
            )}
          />
          <span className={`text-xs font-bold mt-2 ${isDarkMode ? 'text-pink-300/70' : 'text-slate-600'}`}>{grade.advice}</span>
        </div>

        {/* Daily Burn Rate & Forecast */}
        <div className={`p-5 rounded-2xl border space-y-4 col-span-2 transition-all ${
          isDarkMode ? 'bg-[#180814] border-pink-900/30' : 'bg-pink-50/70 border-pink-200/80 shadow-xs'
        }`}>
          <div className="flex items-center gap-2 text-xs font-black text-pink-500 uppercase tracking-wider">
            <FontAwesomeIcon icon={faChartLine} />
            Smart Cash Flow Predictions
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className={`p-4 rounded-xl border transition-all ${
              isDarkMode ? 'bg-[#240c1e] border-pink-900/40' : 'bg-white border-pink-200/80 shadow-2xs'
            }`}>
              <span className={`text-xs font-bold block mb-1 ${isDarkMode ? 'text-pink-300/70' : 'text-slate-600'}`}>Average Daily Spend</span>
              <span className={`text-xl font-black ${isDarkMode ? 'text-pink-100' : 'text-slate-900'}`}>
                ${dailyBurnRate.toFixed(2)} <span className="text-xs font-semibold text-pink-500">/ day</span>
              </span>
            </div>

            <div className={`p-4 rounded-xl border transition-all ${
              isDarkMode ? 'bg-[#240c1e] border-pink-900/40' : 'bg-white border-pink-200/80 shadow-2xs'
            }`}>
              <span className={`text-xs font-bold block mb-1 ${isDarkMode ? 'text-pink-300/70' : 'text-slate-600'}`}>Projected EOM Expenses</span>
              <span className="text-xl font-black text-rose-500">
                ${projectedMonthExpense.toLocaleString()}
              </span>
            </div>
          </div>

          <div className={`p-4 rounded-xl border flex items-center justify-between ${
            projectedEndBalance >= 0
              ? isDarkMode ? 'bg-emerald-950/30 border-emerald-900/50 text-emerald-400' : 'bg-emerald-50 border-emerald-200 text-emerald-800'
              : isDarkMode ? 'bg-rose-950/30 border-rose-900/50 text-rose-400' : 'bg-rose-50 border-rose-200 text-rose-800'
          }`}>
            <div className="flex items-center gap-2 text-xs font-black">
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
