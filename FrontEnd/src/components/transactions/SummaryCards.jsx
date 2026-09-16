import { Row, Col, Progress } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowTrendUp,
  faArrowTrendDown,
  faScaleBalanced,
  faPiggyBank,
  faFilter
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
          className={`cursor-pointer transition-all duration-200 rounded-3xl p-5 border shadow-md hover:shadow-xl ${
            activeFilter === 'income'
              ? 'ring-2 ring-emerald-500 border-emerald-500 bg-emerald-950/30'
              : isDarkMode
              ? 'bg-[#0b1329] border-slate-800 hover:border-emerald-500/50'
              : 'bg-white border-slate-200/80 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <span className={isDarkMode ? 'text-slate-400 font-extrabold text-xs uppercase tracking-wider' : 'text-slate-500 font-bold text-xs uppercase tracking-wider'}>
              Total Inflow
            </span>
            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center text-base ${
              isDarkMode ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-emerald-50 text-emerald-600'
            }`}>
              <FontAwesomeIcon icon={faArrowTrendUp} />
            </div>
          </div>

          <div className="mb-2">
            <span className={`text-2xl lg:text-3xl font-black tracking-tight ${isDarkMode ? 'text-emerald-400' : 'text-slate-900'}`}>
              {formatCurrency(totalIncome)}
            </span>
          </div>

          <div className="flex items-center justify-between text-xs font-semibold">
            <span className={`px-2.5 py-1 rounded-xl font-black ${
              isDarkMode ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-emerald-50 text-emerald-700'
            }`}>
              ▲ Income
            </span>
            <span className="text-slate-400 font-medium flex items-center gap-1">
              <FontAwesomeIcon icon={faFilter} className="text-slate-500 text-[10px]" /> Filter
            </span>
          </div>
        </div>
      </Col>

      {/* 2. Total Expenses Card */}
      <Col xs={24} sm={12} lg={6}>
        <div
          onClick={() => onSelectFilter && onSelectFilter('expense')}
          className={`cursor-pointer transition-all duration-200 rounded-3xl p-5 border shadow-md hover:shadow-xl ${
            activeFilter === 'expense'
              ? 'ring-2 ring-rose-500 border-rose-500 bg-rose-950/30'
              : isDarkMode
              ? 'bg-[#0b1329] border-slate-800 hover:border-rose-500/50'
              : 'bg-white border-slate-200/80 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <span className={isDarkMode ? 'text-slate-400 font-extrabold text-xs uppercase tracking-wider' : 'text-slate-500 font-bold text-xs uppercase tracking-wider'}>
              Total Outflow
            </span>
            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center text-base ${
              isDarkMode ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' : 'bg-rose-50 text-rose-600'
            }`}>
              <FontAwesomeIcon icon={faArrowTrendDown} />
            </div>
          </div>

          <div className="mb-2">
            <span className={`text-2xl lg:text-3xl font-black tracking-tight ${isDarkMode ? 'text-rose-400' : 'text-slate-900'}`}>
              {formatCurrency(totalExpenses)}
            </span>
          </div>

          <div className="flex items-center justify-between text-xs font-semibold">
            <span className={`px-2.5 py-1 rounded-xl font-black ${
              isDarkMode ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' : 'bg-rose-50 text-rose-700'
            }`}>
              ▼ Expenses
            </span>
            <span className="text-slate-400 font-medium flex items-center gap-1">
              <FontAwesomeIcon icon={faFilter} className="text-slate-500 text-[10px]" /> Filter
            </span>
          </div>
        </div>
      </Col>

      {/* 3. Net Balance Card */}
      <Col xs={24} sm={12} lg={6}>
        <div
          onClick={() => onSelectFilter && onSelectFilter('all')}
          className={`cursor-pointer transition-all duration-200 rounded-3xl p-5 border shadow-md hover:shadow-xl ${
            activeFilter === 'all'
              ? 'ring-2 ring-sky-500 border-sky-500 bg-sky-950/40'
              : isDarkMode
              ? 'bg-[#0b1329] border-slate-800 hover:border-sky-600/50'
              : 'bg-white border-slate-200/80 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <span className={isDarkMode ? 'text-slate-400 font-extrabold text-xs uppercase tracking-wider' : 'text-slate-500 font-bold text-xs uppercase tracking-wider'}>
              Net Vault Balance
            </span>
            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center text-base ${
              balance >= 0
                ? isDarkMode ? 'bg-sky-500/20 text-sky-400 border border-sky-500/30' : 'bg-blue-50 text-blue-600'
                : isDarkMode ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' : 'bg-amber-50 text-amber-600'
            }`}>
              <FontAwesomeIcon icon={faScaleBalanced} />
            </div>
          </div>

          <div className="mb-2">
            <span className={`text-2xl lg:text-3xl font-black tracking-tight ${
              balance >= 0
                ? isDarkMode ? 'text-sky-400' : 'text-blue-700'
                : isDarkMode ? 'text-amber-400' : 'text-amber-700'
            }`}>
              {formatCurrency(balance)}
            </span>
          </div>

          <div className="flex items-center justify-between text-xs font-semibold">
            <span className={`px-2.5 py-1 rounded-xl font-black ${
              balance >= 0
                ? isDarkMode ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30' : 'bg-blue-50 text-blue-700'
                : isDarkMode ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'bg-amber-50 text-amber-700'
            }`}>
              {balance >= 0 ? 'Surplus' : 'Deficit'}
            </span>
            <span className="text-slate-400 font-medium">Reset all</span>
          </div>
        </div>
      </Col>

      {/* 4. Savings Ratio Card */}
      <Col xs={24} sm={12} lg={6}>
        <div className={`rounded-3xl p-5 border shadow-md transition-colors duration-200 ${
          isDarkMode ? 'bg-[#0b1329] border-slate-800' : 'bg-white border-slate-200/80'
        }`}>
          <div className="flex items-center justify-between mb-3">
            <span className={isDarkMode ? 'text-slate-400 font-extrabold text-xs uppercase tracking-wider' : 'text-slate-500 font-bold text-xs uppercase tracking-wider'}>
              Savings Rate
            </span>
            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center text-base ${
              isDarkMode ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30' : 'bg-indigo-50 text-indigo-600'
            }`}>
              <FontAwesomeIcon icon={faPiggyBank} />
            </div>
          </div>

          <div className="flex items-baseline justify-between mb-2">
            <span className={`text-2xl lg:text-3xl font-black tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
              {savingsRate}%
            </span>
            <span className="text-cyan-400 text-xs font-bold bg-cyan-500/10 px-2 py-0.5 rounded-lg border border-cyan-500/20">
              Target 20%+
            </span>
          </div>

          <Progress
            percent={savingsRate}
            strokeColor="#06b6d4"
            trailColor={isDarkMode ? '#1e293b' : '#f1f5f9'}
            showInfo={false}
            size="small"
          />
        </div>
      </Col>
    </Row>
  );
};

export default SummaryCards;
