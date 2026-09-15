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
    <Row gutter={[20, 20]} className="mb-6">
      {/* 1. Total Income Card */}
      <Col xs={24} sm={12} lg={6}>
        <div
          onClick={() => onSelectFilter && onSelectFilter('income')}
          className={`group cursor-pointer transition-all duration-300 rounded-3xl p-5 border relative overflow-hidden shadow-sm hover:shadow-lg ${
            activeFilter === 'income'
              ? 'ring-2 ring-emerald-500 border-emerald-500 bg-emerald-950/20'
              : isDarkMode
              ? 'bg-slate-900/90 border-slate-800 hover:border-emerald-500/50'
              : 'bg-white border-slate-200/90 hover:border-emerald-300'
          }`}
        >
          <div className="absolute -top-12 -right-12 w-28 h-28 bg-emerald-500/10 rounded-full blur-xl group-hover:bg-emerald-500/20 transition-all"></div>

          <div className="flex items-center justify-between mb-3 relative z-10">
            <span className="text-emerald-500 font-extrabold text-xs uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> Total Income
            </span>
            <div className="w-11 h-11 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center text-lg shadow-inner border border-emerald-500/20 group-hover:scale-110 transition-transform">
              <FontAwesomeIcon icon={faArrowTrendUp} />
            </div>
          </div>

          <div className="relative z-10 mb-3">
            <span className={`text-2xl sm:text-3xl font-black tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
              {formatCurrency(totalIncome)}
            </span>
          </div>

          <div className="flex items-center justify-between relative z-10">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-black bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
              ▲ Inflow Record
            </span>
            <span className="text-slate-400 text-xs font-semibold flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <FontAwesomeIcon icon={faFilter} className="text-emerald-500" /> Filter Income
            </span>
          </div>
        </div>
      </Col>

      {/* 2. Total Expenses Card */}
      <Col xs={24} sm={12} lg={6}>
        <div
          onClick={() => onSelectFilter && onSelectFilter('expense')}
          className={`group cursor-pointer transition-all duration-300 rounded-3xl p-5 border relative overflow-hidden shadow-sm hover:shadow-lg ${
            activeFilter === 'expense'
              ? 'ring-2 ring-rose-500 border-rose-500 bg-rose-950/20'
              : isDarkMode
              ? 'bg-slate-900/90 border-slate-800 hover:border-rose-500/50'
              : 'bg-white border-slate-200/90 hover:border-rose-300'
          }`}
        >
          <div className="absolute -top-12 -right-12 w-28 h-28 bg-rose-500/10 rounded-full blur-xl group-hover:bg-rose-500/20 transition-all"></div>

          <div className="flex items-center justify-between mb-3 relative z-10">
            <span className="text-rose-500 font-extrabold text-xs uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span> Total Expenses
            </span>
            <div className="w-11 h-11 rounded-2xl bg-rose-500/10 text-rose-500 flex items-center justify-center text-lg shadow-inner border border-rose-500/20 group-hover:scale-110 transition-transform">
              <FontAwesomeIcon icon={faArrowTrendDown} />
            </div>
          </div>

          <div className="relative z-10 mb-3">
            <span className={`text-2xl sm:text-3xl font-black tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
              {formatCurrency(totalExpenses)}
            </span>
          </div>

          <div className="flex items-center justify-between relative z-10">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-black bg-rose-500/10 text-rose-500 border border-rose-500/20">
              ▼ Outflow Record
            </span>
            <span className="text-slate-400 text-xs font-semibold flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <FontAwesomeIcon icon={faFilter} className="text-rose-500" /> Filter Expenses
            </span>
          </div>
        </div>
      </Col>

      {/* 3. Net Balance Card */}
      <Col xs={24} sm={12} lg={6}>
        <div
          onClick={() => onSelectFilter && onSelectFilter('all')}
          className={`group cursor-pointer transition-all duration-300 rounded-3xl p-5 border relative overflow-hidden shadow-sm hover:shadow-lg ${
            activeFilter === 'all'
              ? 'ring-2 ring-sky-500 border-sky-500 bg-sky-950/20'
              : isDarkMode
              ? 'bg-slate-900/90 border-slate-800 hover:border-sky-500/50'
              : 'bg-white border-slate-200/90 hover:border-sky-300'
          }`}
        >
          <div className="absolute -top-12 -right-12 w-28 h-28 bg-sky-500/10 rounded-full blur-xl group-hover:bg-sky-500/20 transition-all"></div>

          <div className="flex items-center justify-between mb-3 relative z-10">
            <span className="text-sky-500 font-extrabold text-xs uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-sky-500 animate-pulse"></span> Net Vault Balance
            </span>
            <div className="w-11 h-11 rounded-2xl bg-sky-500/10 text-sky-500 flex items-center justify-center text-lg shadow-inner border border-sky-500/20 group-hover:scale-110 transition-transform">
              <FontAwesomeIcon icon={faScaleBalanced} />
            </div>
          </div>

          <div className="relative z-10 mb-3">
            <span className={`text-2xl sm:text-3xl font-black tracking-tight ${balance >= 0 ? 'text-sky-500' : 'text-amber-500'}`}>
              {formatCurrency(balance)}
            </span>
          </div>

          <div className="flex items-center justify-between relative z-10">
            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-black border ${
              balance >= 0 ? 'bg-sky-500/10 text-sky-500 border-sky-500/20' : 'bg-amber-500/10 text-amber-500 border-amber-500/20'
            }`}>
              {balance >= 0 ? '★ Net Surplus' : '⚠ Deficit Caution'}
            </span>
            <span className="text-slate-400 text-xs font-semibold flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              Reset Filters
            </span>
          </div>
        </div>
      </Col>

      {/* 4. Savings Ratio Card */}
      <Col xs={24} sm={12} lg={6}>
        <div className={`transition-all duration-300 rounded-3xl p-5 border relative overflow-hidden shadow-sm ${
          isDarkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200/90'
        }`}>
          <div className="absolute -top-12 -right-12 w-28 h-28 bg-indigo-500/10 rounded-full blur-xl"></div>

          <div className="flex items-center justify-between mb-3 relative z-10">
            <span className="text-indigo-500 font-extrabold text-xs uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span> Savings Ratio
            </span>
            <div className="w-11 h-11 rounded-2xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center text-lg shadow-inner border border-indigo-500/20">
              <FontAwesomeIcon icon={faPiggyBank} />
            </div>
          </div>

          <div className="flex items-baseline justify-between relative z-10 mb-2">
            <span className={`text-2xl sm:text-3xl font-black tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
              {savingsRate}%
            </span>
            <span className="text-indigo-400 text-xs font-bold bg-indigo-500/10 px-2 py-0.5 rounded-lg border border-indigo-500/20">
              Target 20%+
            </span>
          </div>

          <div className="relative z-10">
            <Progress
              percent={savingsRate}
              strokeColor={{
                '0%': '#6366f1',
                '100%': '#10b981'
              }}
              trailColor={isDarkMode ? '#1e293b' : '#e2e8f0'}
              showInfo={false}
              size="small"
            />
          </div>
        </div>
      </Col>
    </Row>
  );
};

export default SummaryCards;
