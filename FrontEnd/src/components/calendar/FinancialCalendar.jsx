import { Tag } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarDays, faMoneyBillWave } from '@fortawesome/free-solid-svg-icons';

const CALENDAR_EVENTS = [
  { day: 1, type: 'INCOME', title: '💰 Freelance Client Payout', amount: 450, color: 'emerald' },
  { day: 3, type: 'INCOME', title: '💼 Monthly Salary Deposit', amount: 150000, color: 'emerald' },
  { day: 5, type: 'EXPENSE', title: '🏠 House Rent Due', amount: -35000, color: 'rose' },
  { day: 12, type: 'EXPENSE', title: '🎵 Spotify & Cloud Subscriptions', amount: -1500, color: 'amber' },
  { day: 18, type: 'EXPENSE', title: '💳 Car Loan Installment', amount: -12000, color: 'purple' },
  { day: 25, type: 'EXPENSE', title: '🛍️ Utility & Electricity Bill', amount: -8500, color: 'rose' }
];

const FinancialCalendar = ({ isDarkMode = false, currencySymbol = '$' }) => {
  const daysInGrid = Array.from({ length: 30 }, (_, i) => i + 1);

  return (
    <div className={`p-6 rounded-3xl border transition-all duration-300 backdrop-blur-md shadow-md mb-6 ${
      isDarkMode
        ? 'bg-[#240c1e]/90 border-pink-900/40 shadow-pink-950/20'
        : 'bg-white/95 border-pink-200/80 shadow-pink-100/70'
    }`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-pink-200/60 dark:border-pink-900/40">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-sky-500 to-indigo-600 text-white flex items-center justify-center text-lg shadow-md">
            <FontAwesomeIcon icon={faCalendarDays} />
          </div>
          <div>
            <h3 className={`font-black text-lg block ${isDarkMode ? 'text-pink-100' : 'text-slate-900'} m-0`}>
              📅 Money Calendar (Monthly Paydays & Bill Due Dates)
            </h3>
            <span className={`text-xs font-semibold ${isDarkMode ? 'text-pink-300/70' : 'text-pink-700/80'}`}>
              Visual monthly schedule for paydays, rent, bills, and expected balance after commitments
            </span>
          </div>
        </div>

        <Tag color="purple" className="m-0 font-black px-3.5 py-1.5 rounded-xl text-xs border border-pink-200 shadow-2xs">
          <FontAwesomeIcon icon={faMoneyBillWave} className="mr-1.5" />
          6 Scheduled Commitments
        </Tag>
      </div>

      {/* Calendar Month Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-5 lg:grid-cols-6 gap-3">
        {daysInGrid.map(dayNum => {
          const events = CALENDAR_EVENTS.filter(e => e.day === dayNum);
          const hasEvent = events.length > 0;

          return (
            <div
              key={dayNum}
              className={`p-3 rounded-2xl border min-h-[90px] flex flex-col justify-between transition-all ${
                hasEvent
                  ? isDarkMode ? 'bg-[#180814] border-pink-500/50 shadow-md scale-[1.02]' : 'bg-pink-50 border-pink-300 shadow-xs scale-[1.02]'
                  : isDarkMode ? 'bg-[#180814]/40 border-pink-900/20' : 'bg-white border-slate-100'
              }`}
            >
              <div className="flex items-center justify-between text-xs font-black">
                <span className={isDarkMode ? 'text-pink-300' : 'text-slate-700'}>Sep {dayNum}</span>
                {hasEvent && <span className="w-2 h-2 rounded-full bg-pink-500 animate-ping"></span>}
              </div>

              {hasEvent ? (
                <div className="space-y-1 mt-1">
                  {events.map((ev, i) => (
                    <div key={i} className="text-[10px] font-black line-clamp-1">
                      <Tag color={ev.color} className="m-0 font-black px-1.5 py-0 rounded-md text-[9px] w-full block truncate">
                        {ev.title}
                      </Tag>
                    </div>
                  ))}
                </div>
              ) : (
                <span className="text-[10px] text-slate-400 font-semibold block text-center">-</span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default FinancialCalendar;
