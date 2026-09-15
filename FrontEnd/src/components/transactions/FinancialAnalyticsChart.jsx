import { Progress, Row, Col, Tag } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartColumn, faArrowTrendUp, faArrowTrendDown, faScaleBalanced } from '@fortawesome/free-solid-svg-icons';

const FinancialAnalyticsChart = ({ summary = {}, currencySymbol = '$', isDarkMode = false }) => {
  const { totalIncome = 0, totalExpenses = 0, balance = 0 } = summary;

  const totalVolume = totalIncome + totalExpenses;
  const incomePercent = totalVolume > 0 ? Math.round((totalIncome / totalVolume) * 100) : 50;
  const expensePercent = totalVolume > 0 ? Math.round((totalExpenses / totalVolume) * 100) : 50;

  const fmt = num => `${currencySymbol}${Number(num).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  return (
    <div className={`p-6 rounded-3xl border mb-6 transition-colors duration-300 ${
      isDarkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200/90 shadow-sm'
    }`}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-blue-500/10 text-blue-500 flex items-center justify-center text-lg shadow-inner border border-blue-500/20">
            <FontAwesomeIcon icon={faChartColumn} />
          </div>
          <div>
            <span className={`font-black text-lg block tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
              Cash Flow & Financial Health Insights
            </span>
            <span className={`text-xs font-semibold ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
              Realtime visual comparison of monthly inflow vs outflow
            </span>
          </div>
        </div>

        {balance >= 0 ? (
          <Tag color="emerald" className="m-0 font-black px-3.5 py-1.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-500 text-xs shadow-xs">
            <FontAwesomeIcon icon={faScaleBalanced} className="mr-1.5" />
            Surplus: +{fmt(balance)}
          </Tag>
        ) : (
          <Tag color="rose" className="m-0 font-black px-3.5 py-1.5 rounded-xl border border-rose-500/30 bg-rose-500/10 text-rose-500 text-xs shadow-xs">
            <FontAwesomeIcon icon={faScaleBalanced} className="mr-1.5" />
            Deficit: -{fmt(Math.abs(balance))}
          </Tag>
        )}
      </div>

      <Row gutter={[20, 20]}>
        {/* Income Bar */}
        <Col xs={24} md={12}>
          <div className={`p-5 rounded-2xl border transition-all ${
            isDarkMode ? 'bg-emerald-950/20 border-emerald-900/40' : 'bg-emerald-50/50 border-emerald-200/70'
          }`}>
            <div className="flex items-center justify-between mb-2">
              <span className="font-extrabold text-emerald-500 text-xs uppercase tracking-wider flex items-center gap-1.5">
                <FontAwesomeIcon icon={faArrowTrendUp} /> Total Inflow (Income)
              </span>
              <span className="font-black text-emerald-500 text-lg">{fmt(totalIncome)}</span>
            </div>
            <Progress percent={incomePercent} strokeColor="#10b981" trailColor={isDarkMode ? '#064e3b' : '#a7f3d0'} size="medium" />
            <div className="flex items-center justify-between mt-2 text-xs font-bold text-emerald-600">
              <span>{incomePercent}% share of volume</span>
              <span>Inflow Ratio</span>
            </div>
          </div>
        </Col>

        {/* Expense Bar */}
        <Col xs={24} md={12}>
          <div className={`p-5 rounded-2xl border transition-all ${
            isDarkMode ? 'bg-rose-950/20 border-rose-900/40' : 'bg-rose-50/50 border-rose-200/70'
          }`}>
            <div className="flex items-center justify-between mb-2">
              <span className="font-extrabold text-rose-500 text-xs uppercase tracking-wider flex items-center gap-1.5">
                <FontAwesomeIcon icon={faArrowTrendDown} /> Total Outflow (Expenses)
              </span>
              <span className="font-black text-rose-500 text-lg">{fmt(totalExpenses)}</span>
            </div>
            <Progress percent={expensePercent} strokeColor="#f43f5e" trailColor={isDarkMode ? '#881337' : '#fecdd3'} size="medium" />
            <div className="flex items-center justify-between mt-2 text-xs font-bold text-rose-600">
              <span>{expensePercent}% share of volume</span>
              <span>Outflow Ratio</span>
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default FinancialAnalyticsChart;
