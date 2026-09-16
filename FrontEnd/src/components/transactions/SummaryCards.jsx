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
          className={`cursor-pointer transition-all duration-300 rounded-3xl p-5 border shadow-sm hover:shadow-md hover:scale-[1.02] ${
            activeFilter === 'income'
              ? 'ring-2 ring-emerald-400 border-emerald-400 bg-emerald-500/10'
              : isDarkMode
              ? 'bg-[#240c1e] border-pink-900/40 hover:border-emerald-500/50'
              : 'bg-white border-pink-100 hover:border-emerald-200'
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <span className={isDarkMode ? 'text-emerald-300 font-black text-xs uppercase tracking-wider' : 'text-emerald-700 font-black text-xs uppercase tracking-wider'}>
              Total Inflow 🌸
            </span>
            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center text-base ${
              isDarkMode ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-emerald-50 text-emerald-600 border border-emerald-100'
            }`}>
              <FontAwesomeIcon icon={faArrowTrendUp} />
            </div>
          </div>

          <div className="mb-2">
            <span className={`text-2xl lg:text-3xl font-black tracking-tight ${isDarkMode ? 'text-emerald-400' : 'text-emerald-700'}`}>
              {formatCurrency(totalIncome)}
            </span>
          </div>

          <div className="flex items-center justify-between text-xs font-semibold">
            <span className={`px-3 py-1 rounded-xl font-black ${
              isDarkMode ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-emerald-100/70 text-emerald-800'
            }`}>
              ▲ Income Earned
            </span>
            <span className="text-pink-400/80 font-bold text-[11px]">Filter Inflow</span>
          </div>
        </div>
      </Col>

      {/* 2. Total Expenses Card */}
      <Col xs={24} sm={12} lg={6}>
        <div
          onClick={() => onSelectFilter && onSelectFilter('expense')}
          className={`cursor-pointer transition-all duration-300 rounded-3xl p-5 border shadow-sm hover:shadow-md hover:scale-[1.02] ${
            activeFilter === 'expense'
              ? 'ring-2 ring-pink-400 border-pink-400 bg-pink-500/10'
              : isDarkMode
              ? 'bg-[#240c1e] border-pink-900/40 hover:border-pink-500/50'
              : 'bg-white border-pink-100 hover:border-pink-200'
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <span className={isDarkMode ? 'text-pink-300 font-black text-xs uppercase tracking-wider' : 'text-pink-700 font-black text-xs uppercase tracking-wider'}>
              Total Outflow 🛍️
            </span>
            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center text-base ${
              isDarkMode ? 'bg-pink-500/20 text-pink-400 border border-pink-500/30' : 'bg-pink-50 text-pink-600 border border-pink-100'
            }`}>
              <FontAwesomeIcon icon={faArrowTrendDown} />
            </div>
          </div>

          <div className="mb-2">
            <span className={`text-2xl lg:text-3xl font-black tracking-tight ${isDarkMode ? 'text-pink-400' : 'text-pink-700'}`}>
              {formatCurrency(totalExpenses)}
            </span>
          </div>

          <div className="flex items-center justify-between text-xs font-semibold">
            <span className={`px-3 py-1 rounded-xl font-black ${
              isDarkMode ? 'bg-pink-500/20 text-pink-300 border border-pink-500/30' : 'bg-pink-100/70 text-pink-800'
            }`}>
              ▼ Expenses Spent
            </span>
            <span className="text-pink-400/80 font-bold text-[11px]">Filter Expenses</span>
          </div>
        </div>
      </Col>

      {/* 3. Net Balance Card */}
      <Col xs={24} sm={12} lg={6}>
        <div
          onClick={() => onSelectFilter && onSelectFilter('all')}
          className={`cursor-pointer transition-all duration-300 rounded-3xl p-5 border shadow-sm hover:shadow-md hover:scale-[1.02] ${
            activeFilter === 'all'
              ? 'ring-2 ring-purple-400 border-purple-400 bg-purple-500/10'
              : isDarkMode
              ? 'bg-[#240c1e] border-pink-900/40 hover:border-purple-500/50'
              : 'bg-white border-pink-100 hover:border-purple-200'
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <span className={isDarkMode ? 'text-purple-300 font-black text-xs uppercase tracking-wider' : 'text-purple-700 font-black text-xs uppercase tracking-wider'}>
              Net Vault Balance 💖
            </span>
            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center text-base ${
              balance >= 0
                ? isDarkMode ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' : 'bg-purple-50 text-purple-600 border border-purple-100'
                : isDarkMode ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' : 'bg-amber-50 text-amber-600 border border-amber-100'
            }`}>
              <FontAwesomeIcon icon={faScaleBalanced} />
            </div>
          </div>

          <div className="mb-2">
            <span className={`text-2xl lg:text-3xl font-black tracking-tight ${
              balance >= 0
                ? isDarkMode ? 'text-purple-200' : 'text-purple-800'
                : isDarkMode ? 'text-amber-400' : 'text-amber-700'
            }`}>
              {formatCurrency(balance)}
            </span>
          </div>

          <div className="flex items-center justify-between text-xs font-semibold">
            <span className={`px-3 py-1 rounded-xl font-black ${
              balance >= 0
                ? isDarkMode ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' : 'bg-purple-100/70 text-purple-800'
                : isDarkMode ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'bg-amber-100/70 text-amber-800'
            }`}>
              {balance >= 0 ? '✨ Surplus' : '⚠ Caution'}
            </span>
            <span className="text-pink-400/80 font-bold text-[11px]">Reset all</span>
          </div>
        </div>
      </Col>

      {/* 4. Savings Ratio Card */}
      <Col xs={24} sm={12} lg={6}>
        <div className={`rounded-3xl p-5 border shadow-sm transition-colors duration-300 ${
          isDarkMode ? 'bg-[#240c1e] border-pink-900/40' : 'bg-white border-pink-100'
        }`}>
          <div className="flex items-center justify-between mb-3">
            <span className={isDarkMode ? 'text-fuchsia-300 font-black text-xs uppercase tracking-wider' : 'text-fuchsia-700 font-black text-xs uppercase tracking-wider'}>
              Savings Goal Ratio 💅
            </span>
            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center text-base ${
              isDarkMode ? 'bg-pink-500/20 text-pink-300 border border-pink-500/30' : 'bg-pink-50 text-pink-600 border border-pink-100'
            }`}>
              <FontAwesomeIcon icon={faHeart} />
            </div>
          </div>

          <div className="flex items-baseline justify-between mb-2">
            <span className={`text-2xl lg:text-3xl font-black tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
              {savingsRate}%
            </span>
            <span className="text-pink-500 text-xs font-bold bg-pink-500/10 px-2.5 py-0.5 rounded-lg border border-pink-500/20">
              Target 20%+
            </span>
          </div>

          <Progress
            percent={savingsRate}
            strokeColor="#ec4899"
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
