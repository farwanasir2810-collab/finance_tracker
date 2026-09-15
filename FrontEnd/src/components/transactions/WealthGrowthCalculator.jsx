import { useState } from 'react';
import { InputNumber, Slider, Tag } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartLine, faSeedling, faVault, faPiggyBank } from '@fortawesome/free-solid-svg-icons';

const WealthGrowthCalculator = ({ isDarkMode = false }) => {
  const [initialInvestment, setInitialInvestment] = useState(5000);
  const [monthlyContribution, setMonthlyContribution] = useState(300);
  const [years, setYears] = useState(10);
  const [expectedReturn, setExpectedReturn] = useState(8);

  // Compound Interest Formula: A = P(1 + r/n)^(nt) + PMT * (((1 + r/n)^(nt) - 1) / (r/n))
  const r = expectedReturn / 100;
  const n = 12; // Monthly compounding
  const totalMonths = years * 12;

  const principalFuture = initialInvestment * Math.pow(1 + r / n, totalMonths);
  const contributionsFuture =
    monthlyContribution * ((Math.pow(1 + r / n, totalMonths) - 1) / (r / n));

  const totalFutureValue = Math.round(principalFuture + contributionsFuture);
  const totalInvested = initialInvestment + monthlyContribution * totalMonths;
  const totalInterestEarned = Math.max(0, totalFutureValue - totalInvested);

  return (
    <div className={`p-6 rounded-3xl border transition-colors duration-300 ${
      isDarkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200/90 shadow-sm'
    }`}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center text-lg shadow-inner border border-emerald-500/20">
            <FontAwesomeIcon icon={faSeedling} />
          </div>
          <div>
            <span className={`font-black text-lg block tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
              Wealth Growth & Compound Interest Simulator
            </span>
            <span className={`text-xs font-semibold ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
              Project long-term net worth growth through compound investment returns
            </span>
          </div>
        </div>

        <Tag color="emerald" className="m-0 font-black px-3.5 py-1.5 rounded-xl text-xs border border-emerald-500/30 bg-emerald-500/10 text-emerald-400">
          <FontAwesomeIcon icon={faVault} className="mr-1.5" />
          Projected Value: ${totalFutureValue.toLocaleString()}
        </Tag>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
        {/* Input Controls */}
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-xs font-black mb-1">
              <span className={isDarkMode ? 'text-slate-300' : 'text-slate-700'}>Starting Capital ($)</span>
              <span className="text-emerald-400">${initialInvestment.toLocaleString()}</span>
            </div>
            <InputNumber
              className="w-full rounded-2xl"
              value={initialInvestment}
              onChange={val => setInitialInvestment(val || 0)}
              min={0}
              step={1000}
              prefix="$"
              size="large"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs font-black mb-1">
              <span className={isDarkMode ? 'text-slate-300' : 'text-slate-700'}>Monthly Contribution ($)</span>
              <span className="text-emerald-400">${monthlyContribution.toLocaleString()} / mo</span>
            </div>
            <InputNumber
              className="w-full rounded-2xl"
              value={monthlyContribution}
              onChange={val => setMonthlyContribution(val || 0)}
              min={0}
              step={50}
              prefix="$"
              size="large"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs font-black mb-1">
              <span className={isDarkMode ? 'text-slate-300' : 'text-slate-700'}>Investment Horizon ({years} Years)</span>
              <span className="text-indigo-400">{years} Years</span>
            </div>
            <Slider
              min={1}
              max={30}
              value={years}
              onChange={val => setYears(val)}
              tooltip={{ open: false }}
            />
          </div>

          <div>
            <div className="flex justify-between text-xs font-black mb-1">
              <span className={isDarkMode ? 'text-slate-300' : 'text-slate-700'}>Expected Annual Return ({expectedReturn}%)</span>
              <span className="text-purple-400">{expectedReturn}% APR</span>
            </div>
            <Slider
              min={1}
              max={15}
              value={expectedReturn}
              onChange={val => setExpectedReturn(val)}
              tooltip={{ open: false }}
            />
          </div>
        </div>

        {/* Results Summary Box */}
        <div className={`p-6 rounded-3xl border flex flex-col justify-between space-y-4 ${
          isDarkMode ? 'bg-slate-800/60 border-slate-700/60' : 'bg-slate-50 border-slate-100'
        }`}>
          <div className="flex items-center gap-2 text-xs font-black text-emerald-400 uppercase tracking-wider">
            <FontAwesomeIcon icon={faChartLine} />
            Wealth Horizon Projection ({years} Yrs)
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center text-sm font-semibold">
              <span className="text-slate-400">Total Out-of-Pocket Invested:</span>
              <span className={`font-black ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                ${totalInvested.toLocaleString()}
              </span>
            </div>

            <div className="flex justify-between items-center text-sm font-semibold">
              <span className="text-slate-400">Compound Returns Earned:</span>
              <span className="font-black text-emerald-400">
                +${totalInterestEarned.toLocaleString()}
              </span>
            </div>

            <div className="pt-3 border-t border-slate-700/50 flex justify-between items-center text-base">
              <span className={`font-black ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>Estimated Net Wealth:</span>
              <span className="font-black text-2xl bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                ${totalFutureValue.toLocaleString()}
              </span>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold flex items-center gap-2">
            <FontAwesomeIcon icon={faPiggyBank} />
            <span>Compound growth generates <strong>${totalInterestEarned.toLocaleString()}</strong> in passive returns!</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WealthGrowthCalculator;
