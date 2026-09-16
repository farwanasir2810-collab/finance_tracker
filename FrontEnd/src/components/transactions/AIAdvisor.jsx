import { Tag } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBrain,
  faLightbulb,
  faCircleCheck,
  faTriangleExclamation,
  faShieldHeart,
  faChartLine
} from '@fortawesome/free-solid-svg-icons';

const AIAdvisor = ({ summary = {}, transactions = [], isDarkMode = false }) => {
  const { totalIncome = 0, totalExpenses = 0, balance = 0 } = summary;

  const savingsRate = totalIncome > 0 ? Math.round(((totalIncome - totalExpenses) / totalIncome) * 100) : 0;
  const expenseRatio = totalIncome > 0 ? Math.round((totalExpenses / totalIncome) * 100) : 0;

  // Generate Automated AI Recommendations
  const insights = [];

  if (savingsRate >= 30) {
    insights.push({
      type: 'success',
      icon: faCircleCheck,
      title: 'Optimal Savings Velocity',
      text: `Your savings rate of ${savingsRate}% exceeds the benchmark 20%. Consider allocating surplus to long-term wealth investments.`,
      tagColor: 'emerald'
    });
  } else if (savingsRate < 10 && totalIncome > 0) {
    insights.push({
      type: 'warning',
      icon: faTriangleExclamation,
      title: 'Low Liquidity Margin',
      text: `Current savings rate is ${savingsRate}%. Reducing monthly discretionary outflows will build a healthier liquidity buffer.`,
      tagColor: 'amber'
    });
  }

  if (expenseRatio > 80 && totalIncome > 0) {
    insights.push({
      type: 'danger',
      icon: faTriangleExclamation,
      title: 'High Burn Rate Alert',
      text: `You are spending ${expenseRatio}% of total revenue. Look out for non-essential recurring subscription costs.`,
      tagColor: 'rose'
    });
  }

  if (transactions.length >= 5) {
    insights.push({
      type: 'info',
      icon: faChartLine,
      title: 'Consistent Data Logging',
      text: `Tracked ${transactions.length} entries. High logging frequency improves financial forecasting accuracy.`,
      tagColor: 'blue'
    });
  }

  if (balance >= 2000) {
    insights.push({
      type: 'success',
      icon: faShieldHeart,
      title: 'Healthy Reserve Cushion',
      text: `Your net vault balance provides a solid base for emergency runway allocation and target goals deposits.`,
      tagColor: 'cyan'
    });
  }

  return (
    <div className={`p-6 rounded-3xl border transition-colors duration-300 ${
      isDarkMode ? 'bg-[#0b1329] border-slate-800 shadow-2xl' : 'bg-white border-slate-200/90 shadow-sm'
    }`}>
      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100 dark:border-slate-800">
        <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center text-lg shadow-inner border border-cyan-500/30">
          <FontAwesomeIcon icon={faBrain} />
        </div>
        <div>
          <span className={`font-black text-lg block tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
            VaultX AI Financial Intelligence & Risk Advisory
          </span>
          <span className={`text-xs font-semibold ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
            Automated algorithmic recommendations and risk detection engine
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {insights.map((item, idx) => (
          <div
            key={idx}
            className={`p-4 rounded-2xl border flex items-start gap-3 transition-all ${
              isDarkMode ? 'bg-[#060c1c] border-slate-800 hover:border-slate-700' : 'bg-slate-50 border-slate-100 hover:border-slate-200'
            }`}
          >
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-base shrink-0 ${
              item.type === 'success' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
              item.type === 'danger' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' :
              item.type === 'warning' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
              'bg-sky-500/20 text-sky-400 border border-sky-500/30'
            }`}>
              <FontAwesomeIcon icon={item.icon} />
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className={`font-black text-sm ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{item.title}</span>
                <Tag color={item.tagColor} className="m-0 text-[10px] font-black px-1.5 py-0 border-0 rounded-md uppercase">
                  INSIGHT
                </Tag>
              </div>
              <p className="text-xs font-medium text-slate-400 m-0 leading-relaxed">
                {item.text}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AIAdvisor;
