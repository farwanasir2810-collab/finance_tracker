import { Progress, Tag } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShieldHalved, faCalendarCheck, faLifeRing } from '@fortawesome/free-solid-svg-icons';

const EmergencyRunway = ({ summary = {}, isDarkMode = false }) => {
  const { totalExpenses = 0, balance = 0 } = summary;

  // Monthly expense safety baseline
  const monthlyBurn = totalExpenses > 0 ? totalExpenses : 1200;
  const runwayMonths = balance > 0 ? Number((balance / monthlyBurn).toFixed(1)) : 0;

  // Runway Status
  let statusColor = '#10b981';
  let statusTagColor = 'emerald';
  let statusText = 'Excellent (6+ Months Buffer)';

  if (runwayMonths < 1) {
    statusColor = '#f43f5e';
    statusTagColor = 'rose';
    statusText = 'Critical (< 1 Month Buffer)';
  } else if (runwayMonths < 3) {
    statusColor = '#f59e0b';
    statusTagColor = 'amber';
    statusText = 'Moderate (1-3 Months Buffer)';
  } else if (runwayMonths < 6) {
    statusColor = '#3b82f6';
    statusTagColor = 'blue';
    statusText = 'Good (3-6 Months Buffer)';
  }

  const runwayPercent = Math.min(100, Math.round((runwayMonths / 6) * 100));

  return (
    <div className={`p-6 rounded-3xl border transition-colors duration-300 h-full flex flex-col justify-between ${
      isDarkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200/90 shadow-sm'
    }`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-sky-500/10 text-sky-400 flex items-center justify-center text-lg shadow-inner border border-sky-500/20">
            <FontAwesomeIcon icon={faShieldHalved} />
          </div>
          <div>
            <span className={`font-black text-lg block tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
              Emergency Safety Runway
            </span>
            <span className={`text-xs font-semibold ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
              Months of zero-income survival buffer
            </span>
          </div>
        </div>

        <Tag color={statusTagColor} className="m-0 font-black px-3.5 py-1.5 rounded-xl text-xs border border-white/10">
          <FontAwesomeIcon icon={faLifeRing} className="mr-1.5" />
          {runwayMonths} Mo
        </Tag>
      </div>

      <div className="space-y-3">
        <div className="flex items-baseline justify-between">
          <span className={`text-3xl font-black ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
            {runwayMonths} <span className="text-sm text-slate-400 font-bold">Months Safety Cushion</span>
          </span>
          <span className="text-xs font-bold text-slate-400">{statusText}</span>
        </div>

        <Progress percent={runwayPercent} strokeColor={statusColor} trailColor={isDarkMode ? '#1e293b' : '#e2e8f0'} size="medium" />

        <div className="p-3 rounded-2xl bg-sky-500/10 border border-sky-500/20 text-sky-400 text-xs font-extrabold flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <FontAwesomeIcon icon={faCalendarCheck} />
            Monthly Cost Cushion: ${monthlyBurn.toLocaleString()}
          </span>
          <span>Target: 6 Months</span>
        </div>
      </div>
    </div>
  );
};

export default EmergencyRunway;
