import { Card, Progress, Row, Col, Tag } from 'antd';
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
  Salary: { icon: faBriefcase, color: '#047857', bg: '#ecfdf5' },
  Freelance: { icon: faLaptopCode, color: '#0284c7', bg: '#f0f9ff' },
  Investment: { icon: faCircleDollarToSlot, color: '#4f46e5', bg: '#eef2ff' },
  Groceries: { icon: faCartShopping, color: '#b45309', bg: '#fffbeb' },
  Housing: { icon: faHouse, color: '#be123c', bg: '#fef2f2' },
  Utilities: { icon: faBolt, color: '#d97706', bg: '#fffbe6' },
  Transport: { icon: faCar, color: '#2563eb', bg: '#eff6ff' },
  Food: { icon: faBurger, color: '#c026d3', bg: '#fdf4ff' }
};

export const getCategoryMeta = text => {
  if (!text) return { icon: faReceipt, color: '#64748b', bg: '#f1f5f9' };
  const key = Object.keys(CATEGORY_META).find(k => k.toLowerCase() === text.toLowerCase());
  return key ? CATEGORY_META[key] : { icon: faReceipt, color: '#64748b', bg: '#f1f5f9' };
};

const CategoryAnalytics = ({ transactions = [] }) => {
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
        <Card
          bordered={false}
          className="shadow-sm rounded-2xl border border-slate-200/80 bg-white h-full"
          title={
            <div className="flex items-center gap-2 py-1">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center text-sm shadow-xs">
                <FontAwesomeIcon icon={faChartPie} />
              </div>
              <span className="font-extrabold text-slate-900 text-base">Income Sources Breakdown</span>
            </div>
          }
        >
          {incomeBreakdown.length ? (
            <div className="space-y-4 py-2">
              {incomeBreakdown.map((item, i) => {
                const meta = getCategoryMeta(item.category);
                return (
                  <div key={i} className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition-all">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2.5">
                        <div
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold"
                          style={{ backgroundColor: meta.bg, color: meta.color }}
                        >
                          <FontAwesomeIcon icon={meta.icon} />
                        </div>
                        <span className="font-bold text-slate-800 text-sm">{item.category}</span>
                      </div>
                      <div className="text-right">
                        <span className="font-black text-emerald-700 text-sm block">
                          +${item.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </span>
                        <Tag color="emerald" className="m-0 border-0 font-extrabold text-xs px-2 py-0">
                          {item.percentage}%
                        </Tag>
                      </div>
                    </div>
                    <Progress percent={item.percentage} strokeColor="#059669" trailColor="#e2e8f0" size="small" showInfo={false} />
                  </div>
                );
              })}
            </div>
          ) : (
            <span className="block py-10 text-center font-semibold text-slate-400">No income data recorded yet</span>
          )}
        </Card>
      </Col>

      {/* Expense Distribution */}
      <Col xs={24} lg={12}>
        <Card
          bordered={false}
          className="shadow-sm rounded-2xl border border-slate-200/80 bg-white h-full"
          title={
            <div className="flex items-center gap-2 py-1">
              <div className="w-8 h-8 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center text-sm shadow-xs">
                <FontAwesomeIcon icon={faChartPie} />
              </div>
              <span className="font-extrabold text-slate-900 text-base">Expense Distribution Breakdown</span>
            </div>
          }
        >
          {expenseBreakdown.length ? (
            <div className="space-y-4 py-2">
              {expenseBreakdown.map((item, i) => {
                const meta = getCategoryMeta(item.category);
                return (
                  <div key={i} className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition-all">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2.5">
                        <div
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold"
                          style={{ backgroundColor: meta.bg, color: meta.color }}
                        >
                          <FontAwesomeIcon icon={meta.icon} />
                        </div>
                        <span className="font-bold text-slate-800 text-sm">{item.category}</span>
                      </div>
                      <div className="text-right">
                        <span className="font-black text-rose-700 text-sm block">
                          -${item.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </span>
                        <Tag color="rose" className="m-0 border-0 font-extrabold text-xs px-2 py-0">
                          {item.percentage}%
                        </Tag>
                      </div>
                    </div>
                    <Progress percent={item.percentage} strokeColor="#dc2626" trailColor="#e2e8f0" size="small" showInfo={false} />
                  </div>
                );
              })}
            </div>
          ) : (
            <span className="block py-10 text-center font-semibold text-slate-400">No expense data recorded yet</span>
          )}
        </Card>
      </Col>
    </Row>
  );
};

export default CategoryAnalytics;
