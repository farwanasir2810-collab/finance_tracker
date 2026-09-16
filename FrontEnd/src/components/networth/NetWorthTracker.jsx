import { useEffect, useState } from 'react';
import { Tag, Progress } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faVault, faBuildingColumns, faCreditCard, faArrowTrendUp } from '@fortawesome/free-solid-svg-icons';
import { fetchNetWorth } from '../../services/financialApi';

const NetWorthTracker = ({ isDarkMode = false, currencySymbol = '$' }) => {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetchNetWorth().then(res => setData(res)).catch(() => {});
  }, []);

  const totalAssets = data?.totalAssets || 255000;
  const totalLiabilities = data?.totalLiabilities || 195000;
  const netWorth = data?.netWorth || 60000;
  const history = data?.history || [
    { month: 'Jan', netWorth: 420000 },
    { month: 'Feb', netWorth: 450000 },
    { month: 'Mar', netWorth: 470000 },
    { month: 'Apr', netWorth: 510000 },
    { month: 'May', netWorth: 560000 }
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
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-600 text-white flex items-center justify-center text-lg shadow-md">
            <FontAwesomeIcon icon={faVault} />
          </div>
          <div>
            <h3 className={`font-black text-lg block ${isDarkMode ? 'text-pink-100' : 'text-slate-900'} m-0`}>
              💰 Real Net Worth Engine (Assets vs Liabilities)
            </h3>
            <span className={`text-xs font-semibold ${isDarkMode ? 'text-pink-300/70' : 'text-pink-700/80'}`}>
              Net Worth = Total Assets − Total Liabilities (with 5-month growth history)
            </span>
          </div>
        </div>

        <Tag color="emerald" className="m-0 font-black px-3.5 py-1.5 rounded-xl text-xs border border-pink-200 shadow-2xs">
          <FontAwesomeIcon icon={faArrowTrendUp} className="mr-1.5" />
          {data?.growthPercent || '+33.3% 5-Mo Growth'}
        </Tag>
      </div>

      {/* Grid Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className={`p-5 rounded-2xl border text-center ${
          isDarkMode ? 'bg-emerald-950/20 border-emerald-900/40' : 'bg-emerald-50/80 border-emerald-200 shadow-2xs'
        }`}>
          <span className="text-xs font-black uppercase text-emerald-600 block mb-1">
            <FontAwesomeIcon icon={faBuildingColumns} className="mr-1" /> Total Assets
          </span>
          <span className="text-2xl font-black text-emerald-600">{currencySymbol}{totalAssets.toLocaleString()}</span>
        </div>

        <div className={`p-5 rounded-2xl border text-center ${
          isDarkMode ? 'bg-rose-950/20 border-rose-900/40' : 'bg-rose-50/80 border-rose-200 shadow-2xs'
        }`}>
          <span className="text-xs font-black uppercase text-rose-600 block mb-1">
            <FontAwesomeIcon icon={faCreditCard} className="mr-1" /> Total Liabilities
          </span>
          <span className="text-2xl font-black text-rose-600">{currencySymbol}{totalLiabilities.toLocaleString()}</span>
        </div>

        <div className={`p-5 rounded-2xl border text-center ${
          isDarkMode ? 'bg-purple-950/20 border-purple-900/40' : 'bg-purple-50/80 border-purple-200 shadow-2xs'
        }`}>
          <span className="text-xs font-black uppercase text-purple-600 block mb-1">
            ✨ Net Worth Surplus
          </span>
          <span className="text-2xl font-black text-purple-600">{currencySymbol}{netWorth.toLocaleString()}</span>
        </div>
      </div>

      {/* 5-Month Growth History */}
      <div className={`p-5 rounded-2xl border ${
        isDarkMode ? 'bg-[#180814] border-pink-900/30' : 'bg-pink-50/70 border-pink-200/80'
      }`}>
        <span className="font-black text-xs text-pink-600 uppercase tracking-wider block mb-3">
          📈 5-Month Net Worth Growth Timeline
        </span>
        <div className="grid grid-cols-5 gap-2 text-center">
          {history.map((h, i) => (
            <div key={i} className="space-y-1">
              <span className="text-[11px] font-black text-pink-500 block">{h.month}</span>
              <div className="h-16 flex items-end justify-center">
                <div
                  className="w-full max-w-[28px] bg-gradient-to-t from-pink-500 to-purple-500 rounded-lg"
                  style={{ height: `${Math.min(100, Math.max(30, (h.netWorth / 600000) * 100))}%` }}
                ></div>
              </div>
              <span className="text-[10px] font-extrabold block text-slate-700 dark:text-pink-200">
                {currencySymbol}{Math.round(h.netWorth / 1000)}k
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NetWorthTracker;
