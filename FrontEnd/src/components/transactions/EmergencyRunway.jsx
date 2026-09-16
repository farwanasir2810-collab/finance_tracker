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
  let statusTagColor = 'magenta';
  let statusText = 'Excellent (6+ Months Buffer) 💖';

  if (runwayMonths < 1) {
    statusColor = '#f43f5e';
    statusTagColor = 'rose';
    statusText = 'Critical (< 1 Month Buffer)';
  } else if (runwayMonths < 3) {
    statusColor = '#f59e0b';
    statusTagColor = 'amber';
    statusText = 'Moderate (1-3 Months Buffer)';
  } else if (runwayMonths < 6) {
    statusColor = '#a855f7';
    statusTagColor = 'purple';
    statusText = 'Good (3-6 Months Buffer)';
  }

  const runwayPercent = Math.min(100, Math.round((runwayMonths / 6) * 100));

  return (
    <div className={`p-6 rounded-3xl border transition-all duration-300 h-full flex flex-col justify-between backdrop-blur-md shadow-md ${
      isDarkMode ? 'bg-[#240c1e]/90 border-pink-900/40 shadow-pink-950/20' : 'bg-white/90 border-pink-200/70 shadow-pink-100/60'
    }`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-500 to-indigo-600 text-white flex items-center justify-center text-lg shadow-sm">
            <FontAwesomeIcon icon={faShieldHalved} />
          </div>
          <div>
            <span className={`font-black text-lg block tracking-tight ${isDarkMode ? 'text-pink-100' : 'text-slate-900'}`}>
              Emergency Safety Runway 💖
            </span>
            <span className={`text-xs font-semibold ${isDarkMode ? 'text-pink-300/70' : 'text-pink-700/80'}`}>
              Months of zero-income survival safety buffer
            </span>
          </div>
        </div>

        <Tag color={statusTagColor} className="m-0 font-black px-3.5 py-1.5 rounded-xl text-xs border border-pink-200 shadow-2xs">
          <FontAwesomeIcon icon={faLifeRing} className="mr-1.5" />
          {runwayMonths} Mo
        </Tag>
      </div>

      <div className="space-y-3.5">
        <div className="flex items-baseline justify-between">
          <span className={`text-3xl font-black ${isDarkMode ? 'text-pink-100' : 'text-slate-900'}`}>
            {runwayMonths} <span className="text-xs text-pink-500 font-extrabold">Months Safety Cushion</span>
          </span>
          <span className="text-xs font-black text-pink-500">{statusText}</span>
        </div>

        <Progress percent={runwayPercent} strokeColor={{ '0%': '#ec4899', '100%': statusColor }} trailColor={isDarkMode ? '#3b1132' : '#fce7f3'} size="medium" />

        <div className={`p-3.5 rounded-2xl border text-xs font-black flex items-center justify-between ${
          isDarkMode ? 'bg-pink-950/30 border-pink-900/40 text-pink-200' : 'bg-pink-50 border-pink-200 text-pink-900 shadow-2xs'
        }`}>
          <span className="flex items-center gap-1.5">
            <FontAwesomeIcon icon={faCalendarCheck} className="text-pink-500" />
            Monthly Cost Cushion: ${monthlyBurn.toLocaleString()}
          </span>
          <span className="text-pink-600 font-black">Target: 6 Months</span>
        </div>
      </div>
    </div>
  );
};

export default EmergencyRunway;
