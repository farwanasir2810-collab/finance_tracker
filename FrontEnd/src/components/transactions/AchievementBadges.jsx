import { Tag } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrophy, faMedal, faFire, faShieldHeart } from '@fortawesome/free-solid-svg-icons';

const AchievementBadges = ({ summary = {}, transactionCount = 0, isDarkMode = false }) => {
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
      bg: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
    },
    {
      id: 'active',
      title: 'Active Logger',
      desc: '5+ Entries Logged',
      icon: faFire,
      unlocked: transactionCount >= 5,
      color: 'amber',
      bg: 'bg-amber-500/10 text-amber-500 border-amber-500/20'
    },
    {
      id: 'budget',
      title: 'Budget Master',
      desc: 'Expenses < Income',
      icon: faShieldHeart,
      unlocked: totalExpenses < totalIncome && totalIncome > 0,
      color: 'blue',
      bg: 'bg-blue-500/10 text-blue-500 border-blue-500/20'
    },
    {
      id: 'pro',
      title: 'Fintech Master',
      desc: '10+ Entries Logged',
      icon: faMedal,
      unlocked: transactionCount >= 10,
      color: 'purple',
      bg: 'bg-purple-500/10 text-purple-500 border-purple-500/20'
    }
  ];

  return (
    <div className={`p-5 rounded-3xl border transition-colors duration-300 ${
      isDarkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200/90 shadow-sm'
    }`}>
      <div className="flex items-center gap-2.5 mb-3">
        <div className="w-9 h-9 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center text-base shadow-inner border border-amber-500/20">
          <FontAwesomeIcon icon={faTrophy} />
        </div>
        <span className={`font-black text-sm ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
          Financial Achievements & Milestones
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {badges.map(b => (
          <div
            key={b.id}
            className={`p-3.5 rounded-2xl border flex items-center gap-3 transition-all ${
              b.unlocked
                ? `${b.bg} shadow-2xs`
                : isDarkMode
                ? 'bg-slate-800/40 text-slate-500 border-slate-800 opacity-50'
                : 'bg-slate-50 text-slate-400 border-slate-200 opacity-60'
            }`}
          >
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-base ${
              b.unlocked ? 'bg-white/10 shadow-xs' : 'bg-slate-700/40 text-slate-500'
            }`}>
              <FontAwesomeIcon icon={b.icon} />
            </div>
            <div>
              <div className="font-extrabold text-xs flex items-center gap-1">
                {b.title}
                {b.unlocked && <Tag color="green" className="m-0 text-[9px] font-black px-1.5 py-0 border-0 rounded-md">UNLOCKED</Tag>}
              </div>
              <span className="text-[11px] font-semibold block opacity-80">{b.desc}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AchievementBadges;
