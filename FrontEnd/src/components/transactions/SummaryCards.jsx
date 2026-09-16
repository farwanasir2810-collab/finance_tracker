import { Row, Col, Progress } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowTrendUp,
  faArrowTrendDown,
  faScaleBalanced,
  faHeart
} from '@fortawesome/free-solid-svg-icons';

const SummaryCards = ({ summary = {}, activeFilter = 'all', onSelectFilter, currencySymbol = '$', isDarkMode = false }) => {
  const { totalIncome = 0, totalExpenses = 0, balance = 0 } = summary;

  const formatCurrency = amount => {
    const num = Number(amount) || 0;
    return `${currencySymbol}${num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const savingsRate =
    totalIncome > 0 ? Math.max(0, Math.min(100, Math.round(((totalIncome - totalExpenses) / totalIncome) * 100))) : 0;

  return (
    <Row gutter={[16, 16]} className="mb-6">
      {/* 1. Total Income Card */}
      <Col xs={24} sm={12} lg={6}>
        <div
          onClick={() => onSelectFilter && onSelectFilter('income')}
          className={`cursor-pointer transition-all duration-300 rounded-3xl p-5 border relative overflow-hidden backdrop-blur-md shadow-md hover:shadow-xl hover:scale-[1.03] ${
            activeFilter === 'income'
              ? 'ring-2 ring-emerald-400 border-emerald-400 bg-emerald-500/15'
              : isDarkMode
              ? 'bg-[#240c1e]/90 border-pink-900/40 hover:border-emerald-500/50 shadow-pink-950/20'
              : 'bg-white/90 border-pink-200/70 hover:border-emerald-300 shadow-pink-100/60'
          }`}
        >
          <div className="absolute -right-6 -bottom-6 w-24 h-24 rounded-full bg-emerald-500/10 blur-xl pointer-events-none"></div>
          
          <div className="flex items-center justify-between mb-3">
            <span className={isDarkMode ? 'text-emerald-300 font-black text-xs uppercase tracking-wider' : 'text-emerald-700 font-black text-xs uppercase tracking-wider'}>
              Total Inflow 🌸
            </span>
            <div className={`w-11 h-11 rounded-2xl flex items-center justify-center text-lg shadow-sm ${
              isDarkMode ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-emerald-100/80 text-emerald-600 border border-emerald-200'
            }`}>
              <FontAwesomeIcon icon={faArrowTrendUp} />
            </div>
          </div>

          <div className="mb-3">
            <span className={`text-2xl lg:text-3xl font-black tracking-tight ${isDarkMode ? 'text-emerald-400' : 'text-emerald-600'}`}>
              {formatCurrency(totalIncome)}
            </span>
          </div>

          <div className="flex items-center justify-between text-xs font-semibold">
            <span className={`px-3 py-1 rounded-xl font-black shadow-2xs ${
              isDarkMode ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-emerald-100/90 text-emerald-800 border border-emerald-200'
            }`}>
              ▲ Income Earned
            </span>
            <span className="text-emerald-600 font-black text-[11px] hover:underline">Filter Inflow →</span>
          </div>
        </div>
      </Col>

      {/* 2. Total Expenses Card */}
      <Col xs={24} sm={12} lg={6}>
        <div
          onClick={() => onSelectFilter && onSelectFilter('expense')}
          className={`cursor-pointer transition-all duration-300 rounded-3xl p-5 border relative overflow-hidden backdrop-blur-md shadow-md hover:shadow-xl hover:scale-[1.03] ${
            activeFilter === 'expense'
              ? 'ring-2 ring-pink-400 border-pink-400 bg-pink-500/15'
              : isDarkMode
              ? 'bg-[#240c1e]/90 border-pink-900/40 hover:border-pink-500/50 shadow-pink-950/20'
              : 'bg-white/90 border-pink-200/70 hover:border-pink-300 shadow-pink-100/60'
          }`}
        >
          <div className="absolute -right-6 -bottom-6 w-24 h-24 rounded-full bg-pink-500/10 blur-xl pointer-events-none"></div>

          <div className="flex items-center justify-between mb-3">
            <span className={isDarkMode ? 'text-pink-300 font-black text-xs uppercase tracking-wider' : 'text-pink-700 font-black text-xs uppercase tracking-wider'}>
              Total Outflow 🛍️
            </span>
            <div className={`w-11 h-11 rounded-2xl flex items-center justify-center text-lg shadow-sm ${
              isDarkMode ? 'bg-pink-500/20 text-pink-400 border border-pink-500/30' : 'bg-pink-100/80 text-pink-600 border border-pink-200'
            }`}>
              <FontAwesomeIcon icon={faArrowTrendDown} />
            </div>
          </div>

          <div className="mb-3">
            <span className={`text-2xl lg:text-3xl font-black tracking-tight ${isDarkMode ? 'text-pink-400' : 'text-pink-600'}`}>
              {formatCurrency(totalExpenses)}
            </span>
          </div>

          <div className="flex items-center justify-between text-xs font-semibold">
            <span className={`px-3 py-1 rounded-xl font-black shadow-2xs ${
              isDarkMode ? 'bg-pink-500/20 text-pink-300 border border-pink-500/30' : 'bg-pink-100/90 text-pink-800 border border-pink-200'
            }`}>
              ▼ Expenses Spent
            </span>
            <span className="text-pink-600 font-black text-[11px] hover:underline">Filter Expenses →</span>
          </div>
        </div>
      </Col>

      {/* 3. Net Balance Card */}
      <Col xs={24} sm={12} lg={6}>
        <div
          onClick={() => onSelectFilter && onSelectFilter('all')}
          className={`cursor-pointer transition-all duration-300 rounded-3xl p-5 border relative overflow-hidden backdrop-blur-md shadow-md hover:shadow-xl hover:scale-[1.03] ${
            activeFilter === 'all'
              ? 'ring-2 ring-purple-400 border-purple-400 bg-purple-500/15'
              : isDarkMode
              ? 'bg-[#240c1e]/90 border-pink-900/40 hover:border-purple-500/50 shadow-pink-950/20'
              : 'bg-white/90 border-pink-200/70 hover:border-purple-300 shadow-pink-100/60'
          }`}
        >
          <div className="absolute -right-6 -bottom-6 w-24 h-24 rounded-full bg-purple-500/10 blur-xl pointer-events-none"></div>

          <div className="flex items-center justify-between mb-3">
            <span className={isDarkMode ? 'text-purple-300 font-black text-xs uppercase tracking-wider' : 'text-purple-700 font-black text-xs uppercase tracking-wider'}>
              Net Vault Balance 💖
            </span>
            <div className={`w-11 h-11 rounded-2xl flex items-center justify-center text-lg shadow-sm ${
              balance >= 0
                ? isDarkMode ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' : 'bg-purple-100/80 text-purple-600 border border-purple-200'
                : isDarkMode ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' : 'bg-amber-100/80 text-amber-600 border border-amber-200'
            }`}>
              <FontAwesomeIcon icon={faScaleBalanced} />
            </div>
          </div>

          <div className="mb-3">
            <span className={`text-2xl lg:text-3xl font-black tracking-tight ${
              balance >= 0
                ? isDarkMode ? 'text-purple-200' : 'text-purple-700'
                : isDarkMode ? 'text-amber-400' : 'text-amber-700'
            }`}>
              {formatCurrency(balance)}
            </span>
          </div>

          <div className="flex items-center justify-between text-xs font-semibold">
            <span className={`px-3 py-1 rounded-xl font-black shadow-2xs ${
              balance >= 0
                ? isDarkMode ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' : 'bg-purple-100/90 text-purple-800 border border-purple-200'
                : isDarkMode ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'bg-amber-100/90 text-amber-800 border border-amber-200'
            }`}>
              {balance >= 0 ? '✨ Surplus' : '⚠ Caution'}
            </span>
            <span className="text-purple-600 font-black text-[11px] hover:underline">Reset Filters</span>
          </div>
        </div>
      </Col>

      {/* 4. Savings Ratio Card */}
      <Col xs={24} sm={12} lg={6}>
        <div className={`transition-all duration-300 rounded-3xl p-5 border relative overflow-hidden backdrop-blur-md shadow-md hover:shadow-xl hover:scale-[1.03] ${
          isDarkMode ? 'bg-[#240c1e]/90 border-pink-900/40 shadow-pink-950/20' : 'bg-white/90 border-pink-200/70 shadow-pink-100/60'
        }`}>
          <div className="absolute -right-6 -bottom-6 w-24 h-24 rounded-full bg-rose-500/10 blur-xl pointer-events-none"></div>

          <div className="flex items-center justify-between mb-3">
            <span className={isDarkMode ? 'text-fuchsia-300 font-black text-xs uppercase tracking-wider' : 'text-fuchsia-700 font-black text-xs uppercase tracking-wider'}>
              Savings Goal Ratio 💅
            </span>
            <div className={`w-11 h-11 rounded-2xl flex items-center justify-center text-lg shadow-sm ${
              isDarkMode ? 'bg-pink-500/20 text-pink-300 border border-pink-500/30' : 'bg-pink-100/80 text-pink-600 border border-pink-200'
            }`}>
              <FontAwesomeIcon icon={faHeart} />
            </div>
          </div>

          <div className="flex items-baseline justify-between mb-2">
            <span className={`text-2xl lg:text-3xl font-black tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
              {savingsRate}%
            </span>
            <span className="text-pink-600 font-black text-xs bg-pink-100 px-3 py-1 rounded-xl border border-pink-200 shadow-2xs">
              Target 20%+
            </span>
          </div>

          <Progress
            percent={savingsRate}
            strokeColor={{ '0%': '#ec4899', '100%': '#a855f7' }}
            trailColor={isDarkMode ? '#3b1132' : '#fce7f3'}
            showInfo={false}
            size="small"
          />
        </div>
      </Col>
    </Row>
  );
};

export default SummaryCards;
