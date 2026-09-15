import { Row, Col, Card, Statistic, Progress, Tag } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowTrendUp,
  faArrowTrendDown,
  faScaleBalanced,
  faPiggyBank,
  faFilter
} from '@fortawesome/free-solid-svg-icons';

const SummaryCards = ({ summary = {}, activeFilter = 'all', onSelectFilter, currencySymbol = '$' }) => {
  const { totalIncome = 0, totalExpenses = 0, balance = 0 } = summary;

  const formatCurrency = amount => {
    const num = Number(amount) || 0;
    return `${currencySymbol}${num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const savingsRate =
    totalIncome > 0 ? Math.max(0, Math.min(100, Math.round(((totalIncome - totalExpenses) / totalIncome) * 100))) : 0;

  return (
    <Row gutter={[20, 20]} className="mb-6">
      {/* 1. Total Income (Clickable Filter) */}
      <Col xs={24} sm={12} lg={6}>
        <Card
          bordered={false}
          onClick={() => onSelectFilter && onSelectFilter('income')}
          className={`shadow-sm hover:shadow-md transition-all duration-300 rounded-2xl border cursor-pointer relative overflow-hidden ${
            activeFilter === 'income' ? 'ring-2 ring-emerald-500 border-emerald-500 bg-emerald-50/40' : 'border-emerald-200/70 bg-white'
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-emerald-700 font-bold text-xs uppercase tracking-wider">Total Income</span>
            <div className="w-10 h-10 rounded-xl bg-emerald-100/80 text-emerald-600 flex items-center justify-center text-lg shadow-xs">
              <FontAwesomeIcon icon={faArrowTrendUp} />
            </div>
          </div>
          <Statistic
            value={formatCurrency(totalIncome)}
            valueStyle={{ color: '#047857', fontWeight: 900, fontSize: '1.85rem' }}
          />
          <div className="mt-3 flex items-center justify-between">
            <Tag color="emerald" className="m-0 border-0 font-extrabold px-2.5 py-0.5 rounded-lg text-xs bg-emerald-100 text-emerald-800">
              ▲ Inflow
            </Tag>
            <span className="text-slate-400 text-xs font-semibold flex items-center gap-1">
              <FontAwesomeIcon icon={faFilter} className="text-slate-300" /> Filter
            </span>
          </div>
        </Card>
      </Col>

      {/* 2. Total Expenses (Clickable Filter) */}
      <Col xs={24} sm={12} lg={6}>
        <Card
          bordered={false}
          onClick={() => onSelectFilter && onSelectFilter('expense')}
          className={`shadow-sm hover:shadow-md transition-all duration-300 rounded-2xl border cursor-pointer relative overflow-hidden ${
            activeFilter === 'expense' ? 'ring-2 ring-rose-500 border-rose-500 bg-rose-50/40' : 'border-rose-200/70 bg-white'
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-rose-700 font-bold text-xs uppercase tracking-wider">Total Expenses</span>
            <div className="w-10 h-10 rounded-xl bg-rose-100/80 text-rose-600 flex items-center justify-center text-lg shadow-xs">
              <FontAwesomeIcon icon={faArrowTrendDown} />
            </div>
          </div>
          <Statistic
            value={formatCurrency(totalExpenses)}
            valueStyle={{ color: '#be123c', fontWeight: 900, fontSize: '1.85rem' }}
          />
          <div className="mt-3 flex items-center justify-between">
            <Tag color="rose" className="m-0 border-0 font-extrabold px-2.5 py-0.5 rounded-lg text-xs bg-rose-100 text-rose-800">
              ▼ Outflow
            </Tag>
            <span className="text-slate-400 text-xs font-semibold flex items-center gap-1">
              <FontAwesomeIcon icon={faFilter} className="text-slate-300" /> Filter
            </span>
          </div>
        </Card>
      </Col>

      {/* 3. Net Balance (Clickable Filter - Reset) */}
      <Col xs={24} sm={12} lg={6}>
        <Card
          bordered={false}
          onClick={() => onSelectFilter && onSelectFilter('all')}
          className={`shadow-sm hover:shadow-md transition-all duration-300 rounded-2xl border cursor-pointer relative overflow-hidden ${
            activeFilter === 'all' ? 'ring-2 ring-sky-500 border-sky-400 bg-sky-50/30' : balance >= 0 ? 'border-sky-200/70 bg-white' : 'border-amber-200/70 bg-white'
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <span className={balance >= 0 ? 'text-sky-700 font-bold text-xs uppercase tracking-wider' : 'text-amber-700 font-bold text-xs uppercase tracking-wider'}>
              Net Balance
            </span>
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg shadow-xs ${
                balance >= 0
                  ? 'bg-sky-100/80 text-sky-600'
                  : 'bg-amber-100/80 text-amber-600'
              }`}
            >
              <FontAwesomeIcon icon={faScaleBalanced} />
            </div>
          </div>
          <Statistic
            value={formatCurrency(balance)}
            valueStyle={{
              color: balance >= 0 ? '#0369a1' : '#b45309',
              fontWeight: 900,
              fontSize: '1.85rem'
            }}
          />
          <div className="mt-3 flex items-center justify-between">
            {balance >= 0 ? (
              <Tag color="blue" className="m-0 border-0 font-extrabold px-2.5 py-0.5 rounded-lg text-xs bg-sky-100 text-sky-800">
                ★ Surplus
              </Tag>
            ) : (
              <Tag color="warning" className="m-0 border-0 font-extrabold px-2.5 py-0.5 rounded-lg text-xs bg-amber-100 text-amber-800">
                ⚠ Deficit
              </Tag>
            )}
            <span className="text-slate-400 text-xs font-semibold flex items-center gap-1">
              Reset All
            </span>
          </div>
        </Card>
      </Col>

      {/* 4. Savings Rate Progress */}
      <Col xs={24} sm={12} lg={6}>
        <Card
          bordered={false}
          className="shadow-sm hover:shadow-md transition-all duration-300 rounded-2xl border border-indigo-200/70 bg-white relative overflow-hidden"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-indigo-700 font-bold text-xs uppercase tracking-wider">Savings Ratio</span>
            <div className="w-10 h-10 rounded-xl bg-indigo-100/80 text-indigo-600 flex items-center justify-center text-lg shadow-xs">
              <FontAwesomeIcon icon={faPiggyBank} />
            </div>
          </div>
          <div className="flex items-baseline justify-between mb-2">
            <span className="text-3xl font-black text-slate-900">{savingsRate}%</span>
            <span className="text-slate-500 text-xs font-semibold">Target &gt; 20%</span>
          </div>
          <Progress
            percent={savingsRate}
            strokeColor={{
              '0%': '#4f46e5',
              '100%': '#10b981'
            }}
            trailColor="#e2e8f0"
            showInfo={false}
            size="small"
          />
        </Card>
      </Col>
    </Row>
  );
};

export default SummaryCards;
