import { Tag } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBrain,
  faCircleCheck,
  faTriangleExclamation,
  faShieldHeart,
  faChartLine,
  faWandMagicSparkles
} from '@fortawesome/free-solid-svg-icons';

const AIAdvisor = ({ summary = {}, transactions = [], isDarkMode = false }) => {
  const { totalIncome = 0, totalExpenses = 0, balance = 0 } = summary;

  const savingsRate = totalIncome > 0 ? Math.round(((totalIncome - totalExpenses) / totalIncome) * 100) : 0;
  const expenseRatio = totalIncome > 0 ? Math.round((totalExpenses / totalIncome) * 100) : 0;

  // Generate Automated AI Recommendations
  const insights = [];

  if (savingsRate >= 20) {
    insights.push({
      type: 'success',
      icon: faCircleCheck,
      title: 'Queen Savings Velocity ✨',
      text: `Your savings rate of ${savingsRate}% exceeds your 20% goal target! Deposit surplus into your dream wishlist vault.`,
      tagColor: 'magenta'
    });
  } else if (savingsRate < 10 && totalIncome > 0) {
    insights.push({
      type: 'warning',
      icon: faTriangleExclamation,
      title: 'Low Liquidity Margin 💅',
      text: `Current savings rate is ${savingsRate}%. Cutting non-essential cafe or shopping sprees will boost your cushion.`,
      tagColor: 'volcano'
    });
  }

  if (expenseRatio > 75 && totalIncome > 0) {
    insights.push({
      type: 'danger',
      icon: faTriangleExclamation,
      title: 'High Burn Rate Warning 🛍️',
      text: `You spent ${expenseRatio}% of revenue this period. Keep an eye on recurring subscriptions and shopping sprees!`,
      tagColor: 'rose'
    });
  }

  if (transactions.length >= 3) {
    insights.push({
      type: 'info',
      icon: faChartLine,
      title: 'Active Vibe Log Consistency 🌸',
      text: `Recorded ${transactions.length} entries. Daily habit logging powers accurate personal financial AI recommendations.`,
      tagColor: 'purple'
    });
  }

  if (balance >= 1000) {
    insights.push({
      type: 'success',
      icon: faShieldHeart,
      title: 'Dream Vault Cushion 💖',
      text: `Your vault balance of $${balance.toLocaleString()} provides a comfortable safety cushion for your future goals.`,
      tagColor: 'cyan'
    });
  }

  return (
    <div className={`p-6 rounded-3xl border transition-all duration-300 backdrop-blur-md shadow-md ${
      isDarkMode
        ? 'bg-[#240c1e]/90 border-pink-900/40 shadow-pink-950/20'
        : 'bg-white/90 border-pink-200/70 shadow-pink-100/60'
    }`}>
      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-pink-100 dark:border-pink-900/40">
        <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-pink-500 to-purple-600 text-white flex items-center justify-center text-lg shadow-md shadow-pink-500/20">
          <FontAwesomeIcon icon={faBrain} />
        </div>
        <div>
          <span className={`font-black text-lg block tracking-tight ${isDarkMode ? 'text-pink-100' : 'text-slate-900'}`}>
            Finora AI Vibe & Wealth Intelligence 🌸
          </span>
          <span className={`text-xs font-semibold ${isDarkMode ? 'text-pink-300/70' : 'text-pink-700/80'}`}>
            Automated financial recommendations and spending habit insights
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {insights.map((item, idx) => (
          <div
            key={idx}
            className={`p-4 rounded-2xl border flex items-start gap-3 transition-all hover:scale-[1.01] ${
              isDarkMode
                ? 'bg-[#180814] border-pink-900/30 text-pink-100'
                : 'bg-pink-50/70 border-pink-200/80 text-slate-800 shadow-xs'
            }`}
          >
            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center text-base shrink-0 ${
              item.type === 'success' ? 'bg-pink-500/20 text-pink-500 border border-pink-500/30' :
              item.type === 'danger' ? 'bg-rose-500/20 text-rose-500 border border-rose-500/30' :
              item.type === 'warning' ? 'bg-amber-500/20 text-amber-500 border border-amber-500/30' :
              'bg-purple-500/20 text-purple-500 border border-purple-500/30'
            }`}>
              <FontAwesomeIcon icon={item.icon} />
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className={`font-black text-sm ${isDarkMode ? 'text-pink-100' : 'text-slate-900'}`}>{item.title}</span>
                <Tag color={item.tagColor} className="m-0 text-[10px] font-black px-2 py-0.5 border-0 rounded-lg uppercase">
                  AI INSIGHT
                </Tag>
              </div>
              <p className={`text-xs font-semibold m-0 leading-relaxed ${isDarkMode ? 'text-pink-300/70' : 'text-slate-600'}`}>
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
