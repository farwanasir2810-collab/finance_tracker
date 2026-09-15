import { Progress, Row, Col, Tag } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBriefcase,
  faCartShopping,
  faHouse,
  faBolt,
  faCar,
  faBurger,
  faCircleDollarToSlot,
  faReceipt,
  faChartPie,
  faLaptopCode
} from '@fortawesome/free-solid-svg-icons';

const CATEGORY_META = {
  Salary: { icon: faBriefcase, color: '#10b981', bg: 'rgba(16, 185, 129, 0.15)' },
  Freelance: { icon: faLaptopCode, color: '#3b82f6', bg: 'rgba(59, 130, 246, 0.15)' },
  Investment: { icon: faCircleDollarToSlot, color: '#8b5cf6', bg: 'rgba(139, 92, 246, 0.15)' },
  Groceries: { icon: faCartShopping, color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.15)' },
  Housing: { icon: faHouse, color: '#f43f5e', bg: 'rgba(244, 63, 94, 0.15)' },
  Utilities: { icon: faBolt, color: '#eab308', bg: 'rgba(234, 179, 8, 0.15)' },
  Transport: { icon: faCar, color: '#06b6d4', bg: 'rgba(6, 182, 212, 0.15)' },
  Food: { icon: faBurger, color: '#d946ef', bg: 'rgba(217, 70, 239, 0.15)' }
};

export const getCategoryMeta = text => {
  if (!text) return { icon: faReceipt, color: '#94a3b8', bg: 'rgba(148, 163, 184, 0.15)' };
  const key = Object.keys(CATEGORY_META).find(k => k.toLowerCase() === text.toLowerCase());
  return key ? CATEGORY_META[key] : { icon: faReceipt, color: '#94a3b8', bg: 'rgba(148, 163, 184, 0.15)' };
};

const CategoryAnalytics = ({ transactions = [], isDarkMode = false }) => {
  const incomes = transactions.filter(t => t.type === 'income');
  const expenses = transactions.filter(t => t.type === 'expense');

  const totalIncome = incomes.reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0);
  const totalExpense = expenses.reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0);

  const getGroupedData = (list, total) => {
    const map = {};
    list.forEach(item => {
      const cat = item.category || 'Other';
      map[cat] = (map[cat] || 0) + (Number(item.amount) || 0);
    });

    return Object.keys(map)
      .map(cat => ({
        category: cat,
        amount: map[cat],
        percentage: total > 0 ? Math.round((map[cat] / total) * 100) : 0
      }))
      .sort((a, b) => b.amount - a.amount);
  };

  const incomeBreakdown = getGroupedData(incomes, totalIncome);
  const expenseBreakdown = getGroupedData(expenses, totalExpense);

  return (
    <Row gutter={[24, 24]}>
      {/* Income Sources */}
      <Col xs={24} lg={12}>
        <div className={`p-6 rounded-3xl border transition-colors duration-300 h-full ${
          isDarkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200/90 shadow-sm'
        }`}>
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100 dark:border-slate-800">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center text-lg shadow-inner border border-emerald-500/20">
              <FontAwesomeIcon icon={faChartPie} />
            </div>
            <div>
              <span className={`font-black text-lg block tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                Income Sources Breakdown
              </span>
              <span className={`text-xs font-semibold ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                Revenue category allocation
              </span>
            </div>
          </div>

          {incomeBreakdown.length ? (
            <div className="space-y-4">
              {incomeBreakdown.map((item, i) => {
                const meta = getCategoryMeta(item.category);
                return (
                  <div key={i} className={`p-4 rounded-2xl border transition-all ${
                    isDarkMode ? 'bg-slate-800/60 border-slate-700/60 hover:border-emerald-500/40' : 'bg-slate-50 border-slate-100 hover:border-emerald-200'
                  }`}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold shadow-xs"
                          style={{ backgroundColor: meta.bg, color: meta.color }}
                        >
                          <FontAwesomeIcon icon={meta.icon} />
                        </div>
                        <span className={`font-black text-sm ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{item.category}</span>
                      </div>
                      <div className="text-right">
                        <span className="font-black text-emerald-500 text-base block">
                          +${item.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </span>
                        <Tag color="emerald" className="m-0 border-0 font-black text-xs px-2 py-0.5 rounded-lg">
                          {item.percentage}%
                        </Tag>
                      </div>
                    </div>
                    <Progress percent={item.percentage} strokeColor="#10b981" trailColor={isDarkMode ? '#1e293b' : '#e2e8f0'} size="small" showInfo={false} />
                  </div>
                );
              })}
            </div>
          ) : (
            <span className="block py-12 text-center font-bold text-slate-400">No income records available yet</span>
          )}
        </div>
      </Col>

      {/* Expense Distribution */}
      <Col xs={24} lg={12}>
        <div className={`p-6 rounded-3xl border transition-colors duration-300 h-full ${
          isDarkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200/90 shadow-sm'
        }`}>
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100 dark:border-slate-800">
            <div className="w-10 h-10 rounded-2xl bg-rose-500/10 text-rose-500 flex items-center justify-center text-lg shadow-inner border border-rose-500/20">
              <FontAwesomeIcon icon={faChartPie} />
            </div>
            <div>
              <span className={`font-black text-lg block tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                Expense Distribution Breakdown
              </span>
              <span className={`text-xs font-semibold ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                Outflow category share
              </span>
            </div>
          </div>

          {expenseBreakdown.length ? (
            <div className="space-y-4">
              {expenseBreakdown.map((item, i) => {
                const meta = getCategoryMeta(item.category);
                return (
                  <div key={i} className={`p-4 rounded-2xl border transition-all ${
                    isDarkMode ? 'bg-slate-800/60 border-slate-700/60 hover:border-rose-500/40' : 'bg-slate-50 border-slate-100 hover:border-rose-200'
                  }`}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold shadow-xs"
                          style={{ backgroundColor: meta.bg, color: meta.color }}
                        >
                          <FontAwesomeIcon icon={meta.icon} />
                        </div>
                        <span className={`font-black text-sm ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{item.category}</span>
                      </div>
                      <div className="text-right">
                        <span className="font-black text-rose-500 text-base block">
                          -${item.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </span>
                        <Tag color="rose" className="m-0 border-0 font-black text-xs px-2 py-0.5 rounded-lg">
                          {item.percentage}%
                        </Tag>
                      </div>
                    </div>
                    <Progress percent={item.percentage} strokeColor="#f43f5e" trailColor={isDarkMode ? '#1e293b' : '#e2e8f0'} size="small" showInfo={false} />
                  </div>
                );
              })}
            </div>
          ) : (
            <span className="block py-12 text-center font-bold text-slate-400">No expense records available yet</span>
          )}
        </div>
      </Col>
    </Row>
  );
};

export default CategoryAnalytics;
