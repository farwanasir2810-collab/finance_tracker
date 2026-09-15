import { Card, Tag } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrophy, faMedal, faFire, faShieldHeart } from '@fortawesome/free-solid-svg-icons';

const AchievementBadges = ({ summary = {}, transactionCount = 0 }) => {
  const { totalIncome = 0, totalExpenses = 0 } = summary;

  const savingsRate =
    totalIncome > 0 ? Math.max(0, Math.min(100, Math.round(((totalIncome - totalExpenses) / totalIncome) * 100))) : 0;

  const badges = [
    {
      id: 'saver',
      title: 'Super Saver',
      desc: 'Savings Ratio > 25%',
      icon: faTrophy,
      unlocked: savingsRate >= 25,
      color: 'emerald',
      bg: 'bg-emerald-50 text-emerald-700 border-emerald-200'
    },
    {
      id: 'active',
      title: 'Active Logger',
      desc: '5+ Entries Logged',
      icon: faFire,
      unlocked: transactionCount >= 5,
      color: 'amber',
      bg: 'bg-amber-50 text-amber-700 border-amber-200'
    },
    {
      id: 'budget',
      title: 'Budget Master',
      desc: 'Expenses < Income',
      icon: faShieldHeart,
      unlocked: totalExpenses < totalIncome && totalIncome > 0,
      color: 'blue',
      bg: 'bg-blue-50 text-blue-700 border-blue-200'
    },
    {
      id: 'pro',
      title: 'Fintech Master',
      desc: '10+ Entries Logged',
      icon: faMedal,
      unlocked: transactionCount >= 10,
      color: 'purple',
      bg: 'bg-purple-50 text-purple-700 border-purple-200'
    }
  ];

  return (
    <Card bordered={false} className="shadow-sm rounded-2xl border border-slate-200/80 bg-white">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-7 h-7 rounded-lg bg-yellow-100 text-yellow-600 flex items-center justify-center text-xs shadow-xs">
          <FontAwesomeIcon icon={faTrophy} />
        </div>
        <span className="font-extrabold text-slate-800 text-sm">Financial Achievements & Milestones</span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        {badges.map(b => (
          <div
            key={b.id}
            className={`p-3 rounded-xl border flex items-center gap-3 transition-all ${
              b.unlocked ? `${b.bg} shadow-2xs` : 'bg-slate-50 text-slate-400 border-slate-200 opacity-60'
            }`}
          >
            <div className={`w-9 h-9 rounded-lg flex items-center justify-center text-base ${b.unlocked ? 'bg-white shadow-2xs' : 'bg-slate-200 text-slate-400'}`}>
              <FontAwesomeIcon icon={b.icon} />
            </div>
            <div>
              <div className="font-extrabold text-xs flex items-center gap-1">
                {b.title}
                {b.unlocked && <Tag color="green" className="m-0 text-[10px] px-1 py-0 border-0">UNLOCKED</Tag>}
              </div>
              <span className="text-[11px] font-medium block opacity-80">{b.desc}</span>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default AchievementBadges;
