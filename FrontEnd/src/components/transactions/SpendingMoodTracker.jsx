import { useState } from 'react';
import { Tag, message } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faWandMagicSparkles, faSmileBeam, faBagShopping, faMugHot, faCrown, faGem } from '@fortawesome/free-solid-svg-icons';

const MOODS = [
  { id: 'mindful', label: '🌸 Peaceful & Mindful', color: '#ec4899', bg: 'rgba(236, 72, 153, 0.12)', icon: faSmileBeam, quote: 'Balanced & intentional spending day!' },
  { id: 'shopping', label: '🛍️ Shopping Therapy', color: '#f43f5e', bg: 'rgba(244, 63, 94, 0.12)', icon: faBagShopping, quote: 'Treating myself to new cute items!' },
  { id: 'cozy', label: '☕ Cozy Cafe Vibe', color: '#d97706', bg: 'rgba(217, 119, 6, 0.12)', icon: faMugHot, quote: 'Matcha lattes, pastries & warm chats.' },
  { id: 'selfcare', label: '💅 Self Care & Glow', color: '#a855f7', bg: 'rgba(168, 85, 247, 0.12)', icon: faGem, quote: 'Skincare, spa & wellness priority!' },
  { id: 'queen', label: '💖 Saving Queen', color: '#10b981', bg: 'rgba(16, 185, 129, 0.12)', icon: faCrown, quote: 'Building my dream financial freedom!' }
];

const SpendingMoodTracker = ({ isDarkMode = false }) => {
  const [selectedMood, setSelectedMood] = useState(MOODS[0]);

  const handleSelectMood = mood => {
    setSelectedMood(mood);
    message.success(`Logged today's vibe: ${mood.label}`);
  };

  return (
    <div className={`p-6 rounded-3xl border transition-colors duration-300 mb-6 ${
      isDarkMode
        ? 'bg-[#240c1e] border-pink-900/40 shadow-xl'
        : 'bg-white border-pink-100 shadow-sm'
    }`}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-pink-500/15 text-pink-500 flex items-center justify-center text-lg shadow-inner border border-pink-500/30">
            <FontAwesomeIcon icon={faWandMagicSparkles} />
          </div>
          <div>
            <h3 className={`font-black text-lg block ${isDarkMode ? 'text-pink-100' : 'text-slate-900'} m-0`}>
              Girls' Daily Mood & Spending Vibe
            </h3>
            <span className={`text-xs font-semibold ${isDarkMode ? 'text-pink-300/70' : 'text-pink-600/70'}`}>
              How are you feeling about your money today?
            </span>
          </div>
        </div>

        <Tag color="magenta" className="m-0 font-black px-3.5 py-1.5 rounded-xl text-xs border border-pink-300/30 shadow-xs">
          <FontAwesomeIcon icon={faHeart} className="mr-1.5" />
          {selectedMood.label}
        </Tag>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {MOODS.map(mood => {
          const isSelected = selectedMood.id === mood.id;
          return (
            <button
              key={mood.id}
              onClick={() => handleSelectMood(mood)}
              className={`p-3.5 rounded-2xl border flex flex-col items-center text-center transition-all ${
                isSelected
                  ? 'ring-2 ring-pink-400 scale-105 shadow-md border-pink-400 bg-pink-500/15'
                  : isDarkMode
                  ? 'bg-[#180814] border-pink-900/30 hover:border-pink-700/50'
                  : 'bg-pink-50/50 border-pink-100 hover:border-pink-200'
              }`}
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center text-lg mb-2 shadow-xs"
                style={{ backgroundColor: mood.bg, color: mood.color }}
              >
                <FontAwesomeIcon icon={mood.icon} />
              </div>
              <span className={`font-black text-xs block mb-1 ${isDarkMode ? 'text-pink-100' : 'text-slate-800'}`}>
                {mood.label}
              </span>
              <span className="text-[10px] font-semibold text-pink-400/80 line-clamp-1">
                {mood.quote}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default SpendingMoodTracker;
