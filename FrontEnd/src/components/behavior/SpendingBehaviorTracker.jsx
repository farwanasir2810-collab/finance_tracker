import { useState } from 'react';
import { Tag, message } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFaceSmile, faFaceMeh, faFire, faFaceFrown, faHeart, faBrain } from '@fortawesome/free-solid-svg-icons';

const BEHAVIOR_TAGS = [
  { id: 'worthit', label: '😊 Worth It', color: '#10b981', bg: 'rgba(16, 185, 129, 0.12)', icon: faFaceSmile, note: 'Valuable intentional purchase!' },
  { id: 'neutral', label: '😐 Neutral', color: '#64748b', bg: 'rgba(100, 116, 139, 0.12)', icon: faFaceMeh, note: 'Standard necessity or utility.' },
  { id: 'impulse', label: '🤔 Impulse Purchase', color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.12)', icon: faFire, note: 'Unplanned emotional spending.' },
  { id: 'regret', label: '😕 Regret / Overpriced', color: '#f43f5e', bg: 'rgba(244, 63, 94, 0.12)', icon: faFaceFrown, note: 'Felt overpriced or unnecessary.' }
];

const SpendingBehaviorTracker = ({ isDarkMode = false }) => {
  const [selectedTag, setSelectedTag] = useState(BEHAVIOR_TAGS[0]);

  const handleSelectTag = tag => {
    setSelectedTag(tag);
    message.success(`Recorded purchase behavior context: ${tag.label} ✨`);
  };

  return (
    <div className={`p-6 rounded-3xl border transition-all duration-300 backdrop-blur-md shadow-md mb-6 ${
      isDarkMode
        ? 'bg-[#240c1e]/90 border-pink-900/40 shadow-pink-950/20'
        : 'bg-white/95 border-pink-200/80 shadow-pink-100/70'
    }`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5 pb-4 border-b border-pink-200/60 dark:border-pink-900/40">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-pink-500 to-purple-600 text-white flex items-center justify-center text-lg shadow-md">
            <FontAwesomeIcon icon={faBrain} />
          </div>
          <div>
            <h3 className={`font-black text-lg block ${isDarkMode ? 'text-pink-100' : 'text-slate-900'} m-0`}>
              🧠 Behavioral Purchase Reflection & Pattern Analytics
            </h3>
            <span className={`text-xs font-semibold ${isDarkMode ? 'text-pink-300/70' : 'text-pink-700/80'}`}>
              How did your latest purchases feel? Track emotional spending patterns.
            </span>
          </div>
        </div>

        <Tag color="magenta" className="m-0 font-black px-3.5 py-1.5 rounded-xl text-xs border border-pink-200 shadow-2xs">
          <FontAwesomeIcon icon={faHeart} className="mr-1.5" />
          Selected: {selectedTag.label}
        </Tag>
      </div>

      {/* Grid Buttons */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
        {BEHAVIOR_TAGS.map(tag => {
          const isSelected = selectedTag.id === tag.id;
          return (
            <button
              key={tag.id}
              onClick={() => handleSelectTag(tag)}
              className={`p-4 rounded-2xl border flex flex-col items-center text-center transition-all ${
                isSelected
                  ? 'ring-2 ring-pink-400 scale-105 shadow-md border-pink-400 bg-pink-500/15'
                  : isDarkMode
                  ? 'bg-[#180814] border-pink-900/30 hover:border-pink-700/50'
                  : 'bg-pink-50/50 border-pink-200/80 hover:bg-pink-100/70'
              }`}
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center text-lg mb-2 shadow-xs"
                style={{ backgroundColor: tag.bg, color: tag.color }}
              >
                <FontAwesomeIcon icon={tag.icon} />
              </div>
              <span className={`font-black text-xs block mb-1 ${isDarkMode ? 'text-pink-100' : 'text-slate-800'}`}>
                {tag.label}
              </span>
              <span className="text-[10px] font-semibold text-pink-500/80 line-clamp-1">
                {tag.note}
              </span>
            </button>
          );
        })}
      </div>

      {/* Analytics Banner */}
      <div className={`p-4 rounded-2xl border flex items-center justify-between text-xs font-extrabold ${
        isDarkMode ? 'bg-pink-950/20 border-pink-900/30 text-pink-200' : 'bg-pink-50 border-pink-200 text-pink-900'
      }`}>
        <span className="flex items-center gap-2">
          <FontAwesomeIcon icon={faBrain} className="text-pink-500" />
          Behavioral Data Insight: Impulse-tagged purchases account for <strong>22% of discretionary spending</strong> this month.
        </span>
        <span className="text-pink-600 font-black">Pattern: Highest after 9 PM</span>
      </div>
    </div>
  );
};

export default SpendingBehaviorTracker;
