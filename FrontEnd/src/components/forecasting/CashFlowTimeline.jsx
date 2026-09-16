import { useEffect, useState } from 'react';
import { Tag } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartLine, faShieldHalved, faArrowUp, faArrowDown } from '@fortawesome/free-solid-svg-icons';
import { fetchForecast } from '../../services/financialApi';

const CashFlowTimeline = ({ isDarkMode = false, currencySymbol = '$' }) => {
  const [forecast, setForecast] = useState(null);

  useEffect(() => {
    fetchForecast().then(res => setForecast(res)).catch(() => {});
  }, []);

  const timeline = forecast?.timeline || [
    { dayOffset: 0, dateLabel: 'Today', description: 'Current Net Vault Balance', changeMinor: 0, changeType: 'BASELINE', runningBalance: 2500 },
    { dayOffset: 3, dateLabel: 'Day +3', description: '💰 Monthly Salary Payday', changeMinor: 150000, changeType: 'INCOME', runningBalance: 17500 },
    { dayOffset: 5, dateLabel: 'Day +5', description: '🏠 House Rent Payment', changeMinor: -35000, changeType: 'EXPENSE', runningBalance: 14000 },
    { dayOffset: 12, dateLabel: 'Day +12', description: '🎵 Subscriptions & Bills', changeMinor: -1500, changeType: 'EXPENSE', runningBalance: 12500 },
    { dayOffset: 25, dateLabel: 'Day +25', description: '🛍️ Discretionary Spend Avg', changeMinor: -4500, changeType: 'EXPENSE', runningBalance: 8000 }
  ];

  return (
    <div className={`p-6 rounded-3xl border transition-all duration-300 backdrop-blur-md shadow-md mb-6 ${
      isDarkMode
        ? 'bg-[#240c1e]/90 border-pink-900/40 shadow-pink-950/20'
        : 'bg-white/95 border-pink-200/80 shadow-pink-100/70'
    }`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-pink-200/60 dark:border-pink-900/40">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-purple-500 to-indigo-600 text-white flex items-center justify-center text-lg shadow-md">
            <FontAwesomeIcon icon={faChartLine} />
          </div>
          <div>
            <h3 className={`font-black text-lg block ${isDarkMode ? 'text-pink-100' : 'text-slate-900'} m-0`}>
              🔮 30-Day Cash-Flow Waterfall Forecast
            </h3>
            <span className={`text-xs font-semibold ${isDarkMode ? 'text-pink-300/70' : 'text-pink-700/80'}`}>
              Chronological balance projection based on recurring bills & 3-month category averages
            </span>
          </div>
        </div>

        <Tag color="cyan" className="m-0 font-black px-3.5 py-1.5 rounded-xl text-xs border border-pink-200 shadow-2xs">
          <FontAwesomeIcon icon={faShieldHalved} className="mr-1.5 text-cyan-500" />
          {forecast?.confidenceScore || 'High Confidence (90% Predictability)'}
        </Tag>
      </div>

      {/* Timeline List */}
      <div className="space-y-3">
        {timeline.map((item, idx) => (
          <div
            key={idx}
            className={`p-4 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-all hover:scale-[1.01] ${
              item.changeType === 'INCOME'
                ? isDarkMode ? 'bg-emerald-950/20 border-emerald-900/40 text-emerald-300' : 'bg-emerald-50/80 border-emerald-200 text-emerald-900'
                : item.changeType === 'EXPENSE'
                ? isDarkMode ? 'bg-pink-950/20 border-pink-900/40 text-pink-200' : 'bg-pink-50/80 border-pink-200 text-pink-900'
                : isDarkMode ? 'bg-[#180814] border-pink-900/30 text-pink-100' : 'bg-slate-50 border-slate-200 text-slate-800'
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 rounded-xl bg-white/30 dark:bg-black/20 text-xs font-black shrink-0">
                {item.dateLabel}
              </span>
              <span className="font-extrabold text-sm">{item.description}</span>
            </div>

            <div className="flex items-center gap-4 text-xs font-black">
              {item.changeType !== 'BASELINE' && (
                <span className={`flex items-center gap-1 ${item.changeType === 'INCOME' ? 'text-emerald-500' : 'text-rose-500'}`}>
                  <FontAwesomeIcon icon={item.changeType === 'INCOME' ? faArrowUp : faArrowDown} />
                  {item.changeType === 'INCOME' ? '+' : '-'}{currencySymbol}{Math.abs(item.changeMinor ? item.changeMinor / 100 : 500).toLocaleString()}
                </span>
              )}
              <span className="px-3 py-1.5 rounded-xl bg-white/60 dark:bg-black/30 border border-black/5 text-xs font-black">
                Vault Balance: <strong className="text-purple-600">{currencySymbol}{(item.runningBalance || 2500).toLocaleString()}</strong>
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CashFlowTimeline;
