import { Card, Progress, Row, Col, Tag } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartColumn, faArrowTrendUp, faArrowTrendDown, faScaleBalanced } from '@fortawesome/free-solid-svg-icons';

const FinancialAnalyticsChart = ({ summary = {}, currencySymbol = '$' }) => {
  const { totalIncome = 0, totalExpenses = 0, balance = 0 } = summary;

  const totalVolume = totalIncome + totalExpenses;
  const incomePercent = totalVolume > 0 ? Math.round((totalIncome / totalVolume) * 100) : 50;
  const expensePercent = totalVolume > 0 ? Math.round((totalExpenses / totalVolume) * 100) : 50;

  const fmt = num => `${currencySymbol}${Number(num).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  return (
    <Card bordered={false} className="shadow-sm rounded-2xl border border-slate-200/80 bg-white mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center text-sm shadow-xs">
            <FontAwesomeIcon icon={faChartColumn} />
          </div>
          <div>
            <span className="font-extrabold text-slate-900 text-base block">Cash Flow & Financial Health Overview</span>
            <span className="text-slate-400 text-xs font-semibold">Visual Income vs Outflow Comparison</span>
          </div>
        </div>

        {balance >= 0 ? (
          <Tag color="emerald" className="font-extrabold px-3 py-1 rounded-full border border-emerald-200 bg-emerald-50 text-emerald-700 text-xs">
            <FontAwesomeIcon icon={faScaleBalanced} className="mr-1.5" />
            Net Surplus: {fmt(balance)}
          </Tag>
        ) : (
          <Tag color="rose" className="font-extrabold px-3 py-1 rounded-full border border-rose-200 bg-rose-50 text-rose-700 text-xs">
            <FontAwesomeIcon icon={faScaleBalanced} className="mr-1.5" />
            Net Deficit: {fmt(Math.abs(balance))}
          </Tag>
        )}
      </div>

      <Row gutter={[24, 24]}>
        {/* Income Bar */}
        <Col xs={24} md={12}>
          <div className="p-4 rounded-xl border border-emerald-100 bg-emerald-50/40 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-emerald-800 text-xs uppercase flex items-center gap-1.5">
                <FontAwesomeIcon icon={faArrowTrendUp} /> Total Inflow (Income)
              </span>
              <span className="font-black text-emerald-700 text-base">{fmt(totalIncome)}</span>
            </div>
            <Progress percent={incomePercent} strokeColor="#059669" trailColor="#d1fae5" size="medium" />
            <span className="text-emerald-600 text-xs font-semibold block">{incomePercent}% of total volume</span>
          </div>
        </Col>

        {/* Expense Bar */}
        <Col xs={24} md={12}>
          <div className="p-4 rounded-xl border border-rose-100 bg-rose-50/40 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-rose-800 text-xs uppercase flex items-center gap-1.5">
                <FontAwesomeIcon icon={faArrowTrendDown} /> Total Outflow (Expenses)
              </span>
              <span className="font-black text-rose-700 text-base">{fmt(totalExpenses)}</span>
            </div>
            <Progress percent={expensePercent} strokeColor="#dc2626" trailColor="#ffe4e6" size="medium" />
            <span className="text-rose-600 text-xs font-semibold block">{expensePercent}% of total volume</span>
          </div>
        </Col>
      </Row>
    </Card>
  );
};

export default FinancialAnalyticsChart;
