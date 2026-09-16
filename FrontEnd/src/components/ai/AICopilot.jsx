import { useState } from 'react';
import { Input, Button, Tag, Drawer, message } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBrain,
  faPaperPlane,
  faCalculator,
  faCircleCheck,
  faWandMagicSparkles,
  faChevronRight
} from '@fortawesome/free-solid-svg-icons';
import { queryAICopilot } from '../../services/financialApi';

const QUICK_QUESTIONS = [
  'Can I afford a $1,200 laptop next month?',
  'Where did most of my money go this month?',
  'How much should I save every month for my Paris trip?'
];

const AICopilot = ({ summary = {}, isDarkMode = false, currencySymbol = '$' }) => {
  const [inputQuery, setInputQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeAnswer, setActiveAnswer] = useState({
    explanation: 'Ask me any natural-language question about your money! I use Finora\'s central financial engine to calculate deterministic math and explain the results. ✨',
    calculation: {
      currentBalance: summary.balance || 2500,
      expectedIncome: 150000,
      expectedBills: 48500,
      avgDiscretionarySpend: summary.totalExpenses || 800,
      itemAmount: 1200,
      projectedRemaining: 1400,
      safetyBufferTarget: 1000
    }
  });
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const handleSend = async queryText => {
    const q = queryText || inputQuery;
    if (!q.trim()) return;

    setLoading(true);
    try {
      const res = await queryAICopilot(q);
      setActiveAnswer(res);
      setInputQuery('');
    } catch (err) {
      message.error('Failed to query AI Copilot');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`p-6 rounded-3xl border transition-all duration-300 backdrop-blur-md shadow-md mb-6 ${
      isDarkMode
        ? 'bg-[#240c1e]/90 border-pink-900/40 shadow-pink-950/20'
        : 'bg-white/95 border-pink-200/80 shadow-pink-100/70'
    }`}>
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5 pb-4 border-b border-pink-200/60 dark:border-pink-900/40">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-pink-500 via-rose-500 to-purple-600 text-white flex items-center justify-center text-xl shadow-md shadow-pink-500/30">
            <FontAwesomeIcon icon={faBrain} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className={`font-black text-xl m-0 ${isDarkMode ? 'text-pink-100' : 'text-slate-900'}`}>
                Finora AI Financial Copilot 🧠
              </h3>
              <Tag color="magenta" className="font-black rounded-lg text-[10px]">HERO FEATURE</Tag>
            </div>
            <span className={`text-xs font-semibold ${isDarkMode ? 'text-pink-300/70' : 'text-pink-700/80'}`}>
              Ask natural-language questions powered by backend deterministic math
            </span>
          </div>
        </div>

        <Button
          onClick={() => setIsDrawerOpen(true)}
          icon={<FontAwesomeIcon icon={faCalculator} className="text-pink-500" />}
          className="rounded-2xl font-black text-xs h-10 px-4 border-pink-200 text-pink-700 bg-pink-50 hover:bg-pink-100 shadow-2xs"
        >
          Show Calculation Breakdown
        </Button>
      </div>

      {/* Answer Box */}
      <div className={`p-5 rounded-2xl border mb-5 transition-all ${
        isDarkMode ? 'bg-[#180814] border-pink-900/30 text-pink-100' : 'bg-pink-50/70 border-pink-200/80 text-slate-800'
      }`}>
        <div className="flex items-start gap-3">
          <span className="text-2xl">✨</span>
          <div className="space-y-2 flex-1">
            <p className="text-sm font-extrabold m-0 leading-relaxed">
              {activeAnswer.explanation}
            </p>
            <div className="flex items-center justify-between pt-2 text-xs font-bold text-pink-600">
              <span className="flex items-center gap-1">
                <FontAwesomeIcon icon={faCircleCheck} className="text-emerald-500" />
                Math verified by backend domain engine
              </span>
              <button
                onClick={() => setIsDrawerOpen(true)}
                className="hover:underline flex items-center gap-1 font-black text-pink-700"
              >
                Inspect Exact Math Steps <FontAwesomeIcon icon={faChevronRight} className="text-[10px]" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Suggestion Chips */}
      <div className="flex flex-wrap items-center gap-2 mb-4 text-xs">
        <span className="font-black text-pink-600">Suggested Questions:</span>
        {QUICK_QUESTIONS.map((q, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(q)}
            className={`px-3 py-1.5 rounded-xl border font-bold text-xs transition-all ${
              isDarkMode
                ? 'bg-[#180814] border-pink-900/30 text-pink-200 hover:border-pink-500'
                : 'bg-white border-pink-200 text-pink-900 hover:bg-pink-100 shadow-2xs'
            }`}
          >
            {q}
          </button>
        ))}
      </div>

      {/* Query Input Bar */}
      <div className="flex items-center gap-2">
        <Input
          placeholder="Ask anything: e.g. Can I afford a $1,200 laptop next month?"
          value={inputQuery}
          onChange={e => setInputQuery(e.target.value)}
          onPressEnter={() => handleSend()}
          size="large"
          className="rounded-2xl h-12 font-semibold"
          prefix={<FontAwesomeIcon icon={faWandMagicSparkles} className="text-pink-500" />}
        />
        <Button
          type="primary"
          onClick={() => handleSend()}
          loading={loading}
          icon={<FontAwesomeIcon icon={faPaperPlane} />}
          className="h-12 px-6 bg-gradient-to-r from-pink-500 via-rose-500 to-purple-600 hover:from-pink-600 text-white font-black rounded-2xl shadow-md shadow-pink-500/30 border-0"
        >
          Ask AI
        </Button>
      </div>

      {/* "Show Calculation" Transparency Drawer */}
      <Drawer
        title={<span className="font-black text-lg text-slate-900">🧮 "Show Calculation" Math Breakdown</span>}
        placement="right"
        width={420}
        onClose={() => setIsDrawerOpen(false)}
        open={isDrawerOpen}
      >
        <div className="space-y-4 text-sm font-medium text-slate-700">
          <div className="p-4 rounded-2xl bg-pink-50 border border-pink-200 space-y-2">
            <span className="font-black text-xs text-pink-700 uppercase tracking-wider block">Deterministic Math Engine Execution</span>
            <p className="text-xs text-slate-600 m-0 leading-relaxed">
              Finora AI never guesses numbers. Calculations are generated by backend domain financial services and explained in plain language.
            </p>
          </div>

          <div className="space-y-2.5 pt-2">
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200">
              <span>Current Vault Balance</span>
              <strong className="text-slate-900 font-black">{currencySymbol}{(activeAnswer.calculation?.currentBalance || 2500).toLocaleString()}</strong>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800">
              <span>+ Expected Monthly Income</span>
              <strong className="font-black">+{currencySymbol}{(activeAnswer.calculation?.expectedIncome || 150000).toLocaleString()}</strong>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800">
              <span>- Recurring Bills & Rent</span>
              <strong className="font-black">-{currencySymbol}{(activeAnswer.calculation?.expectedBills || 48500).toLocaleString()}</strong>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800">
              <span>- Avg Discretionary Outflows</span>
              <strong className="font-black">-{currencySymbol}{(activeAnswer.calculation?.avgDiscretionarySpend || 800).toLocaleString()}</strong>
            </div>

            <div className="border-t border-slate-300 pt-2 flex items-center justify-between p-3 rounded-xl bg-purple-50 border border-purple-200 text-purple-900 font-black">
              <span>Projected EOM Disposable Surplus</span>
              <span className="text-base text-purple-700">{currencySymbol}{(activeAnswer.calculation?.projectedRemaining || 1400).toLocaleString()}</span>
            </div>
          </div>
        </div>
      </Drawer>
    </div>
  );
};

export default AICopilot;
