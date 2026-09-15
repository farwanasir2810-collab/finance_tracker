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
          className={`cursor-pointer transition-all duration-200 rounded-2xl p-5 border shadow-xs hover:shadow-sm ${
            activeFilter === 'income'
              ? 'ring-2 ring-emerald-500 border-emerald-500 bg-emerald-500/5'
              : isDarkMode
              ? 'bg-slate-900 border-slate-800 hover:border-slate-700'
              : 'bg-white border-slate-200/80 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-slate-500 font-bold text-xs uppercase tracking-wider">
              Total Inflow
            </span>
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm ${
              isDarkMode ? 'bg-emerald-500/15 text-emerald-400' : 'bg-emerald-50 text-emerald-600'
            }`}>
              <FontAwesomeIcon icon={faArrowTrendUp} />
            </div>
          </div>

          <div className="mb-2">
            <span className={`text-2xl lg:text-3xl font-extrabold tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
              {formatCurrency(totalIncome)}
            </span>
          </div>

          <div className="flex items-center justify-between text-xs font-semibold">
            <span className={`px-2 py-0.5 rounded-md font-bold ${
              isDarkMode ? 'bg-emerald-500/10 text-emerald-400' : 'bg-emerald-50 text-emerald-700'
            }`}>
              ▲ Income
            </span>
            <span className="text-slate-400 font-medium">Click to filter</span>
          </div>
        </div>
      </Col>

      {/* 2. Total Expenses Card */}
      <Col xs={24} sm={12} lg={6}>
        <div
          onClick={() => onSelectFilter && onSelectFilter('expense')}
          className={`cursor-pointer transition-all duration-200 rounded-2xl p-5 border shadow-xs hover:shadow-sm ${
            activeFilter === 'expense'
              ? 'ring-2 ring-rose-500 border-rose-500 bg-rose-500/5'
              : isDarkMode
              ? 'bg-slate-900 border-slate-800 hover:border-slate-700'
              : 'bg-white border-slate-200/80 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-slate-500 font-bold text-xs uppercase tracking-wider">
              Total Outflow
            </span>
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm ${
              isDarkMode ? 'bg-rose-500/15 text-rose-400' : 'bg-rose-50 text-rose-600'
            }`}>
              <FontAwesomeIcon icon={faArrowTrendDown} />
            </div>
          </div>

          <div className="mb-2">
            <span className={`text-2xl lg:text-3xl font-extrabold tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
              {formatCurrency(totalExpenses)}
            </span>
          </div>

          <div className="flex items-center justify-between text-xs font-semibold">
            <span className={`px-2 py-0.5 rounded-md font-bold ${
              isDarkMode ? 'bg-rose-500/10 text-rose-400' : 'bg-rose-50 text-rose-700'
            }`}>
              ▼ Expenses
            </span>
            <span className="text-slate-400 font-medium">Click to filter</span>
          </div>
        </div>
      </Col>

      {/* 3. Net Balance Card */}
      <Col xs={24} sm={12} lg={6}>
        <div
          onClick={() => onSelectFilter && onSelectFilter('all')}
          className={`cursor-pointer transition-all duration-200 rounded-2xl p-5 border shadow-xs hover:shadow-sm ${
            activeFilter === 'all'
              ? 'ring-2 ring-blue-500 border-blue-500 bg-blue-500/5'
              : isDarkMode
              ? 'bg-slate-900 border-slate-800 hover:border-slate-700'
              : 'bg-white border-slate-200/80 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-slate-500 font-bold text-xs uppercase tracking-wider">
              Net Balance
            </span>
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm ${
              balance >= 0
                ? isDarkMode ? 'bg-blue-500/15 text-blue-400' : 'bg-blue-50 text-blue-600'
                : isDarkMode ? 'bg-amber-500/15 text-amber-400' : 'bg-amber-50 text-amber-600'
            }`}>
              <FontAwesomeIcon icon={faScaleBalanced} />
            </div>
          </div>

          <div className="mb-2">
            <span className={`text-2xl lg:text-3xl font-extrabold tracking-tight ${
              balance >= 0
                ? isDarkMode ? 'text-blue-400' : 'text-blue-700'
                : isDarkMode ? 'text-amber-400' : 'text-amber-700'
            }`}>
              {formatCurrency(balance)}
            </span>
          </div>

          <div className="flex items-center justify-between text-xs font-semibold">
            <span className={`px-2 py-0.5 rounded-md font-bold ${
              balance >= 0
                ? isDarkMode ? 'bg-blue-500/10 text-blue-400' : 'bg-blue-50 text-blue-700'
                : isDarkMode ? 'bg-amber-500/10 text-amber-400' : 'bg-amber-50 text-amber-700'
            }`}>
              {balance >= 0 ? 'Surplus' : 'Deficit'}
            </span>
            <span className="text-slate-400 font-medium">Reset filters</span>
          </div>
        </div>
      </Col>

      {/* 4. Savings Ratio Card */}
      <Col xs={24} sm={12} lg={6}>
        <div className={`rounded-2xl p-5 border shadow-xs transition-colors duration-200 ${
          isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200/80'
        }`}>
          <div className="flex items-center justify-between mb-3">
            <span className="text-slate-500 font-bold text-xs uppercase tracking-wider">
              Savings Rate
            </span>
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm ${
              isDarkMode ? 'bg-indigo-500/15 text-indigo-400' : 'bg-indigo-50 text-indigo-600'
            }`}>
              <FontAwesomeIcon icon={faPiggyBank} />
            </div>
          </div>

          <div className="flex items-baseline justify-between mb-2">
            <span className={`text-2xl lg:text-3xl font-extrabold tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
              {savingsRate}%
            </span>
            <span className="text-slate-400 text-xs font-medium">
              Target 20%+
            </span>
          </div>

          <Progress
            percent={savingsRate}
            strokeColor="#4f46e5"
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
