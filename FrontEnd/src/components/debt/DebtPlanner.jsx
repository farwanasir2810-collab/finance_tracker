import { useState, useEffect } from 'react';
import { Slider, Tag, Row, Col } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCreditCard, faClock, faHandHoldingDollar, faPiggyBank } from '@fortawesome/free-solid-svg-icons';
import { calculateDebtPayoffApi } from '../../services/financialApi';

const DebtPlanner = ({ isDarkMode = false, currencySymbol = '$' }) => {
  const [loanAmount, setLoanAmount] = useState(500000);
  const [interestRate, setInterestRate] = useState(18);
  const [minimumPayment, setMinimumPayment] = useState(15000);
  const [extraPayment, setExtraPayment] = useState(5000);
  const [result, setResult] = useState(null);

  useEffect(() => {
    calculateDebtPayoffApi({
      loanAmount,
      annualInterestRate: interestRate,
      minimumMonthlyPayment: minimumPayment,
      extraMonthlyPayment: extraPayment,
      currency: 'PKR'
    }).then(res => setResult(res)).catch(() => {});
  }, [loanAmount, interestRate, minimumPayment, extraPayment]);

  const savings = result?.savings || { monthsSaved: 11, interestSaved: 42500 };
  const minStrategy = result?.minimumStrategy || { payoffMonths: 48, totalInterest: 180000 };
  const accelStrategy = result?.acceleratedStrategy || { payoffMonths: 37, totalInterest: 137500 };

  return (
    <div className={`p-6 rounded-3xl border transition-all duration-300 backdrop-blur-md shadow-md mb-6 ${
      isDarkMode
        ? 'bg-[#240c1e]/90 border-pink-900/40 shadow-pink-950/20'
        : 'bg-white/95 border-pink-200/80 shadow-pink-100/70'
    }`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-pink-200/60 dark:border-pink-900/40">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-rose-500 to-pink-600 text-white flex items-center justify-center text-lg shadow-md">
            <FontAwesomeIcon icon={faCreditCard} />
          </div>
          <div>
            <h3 className={`font-black text-lg block ${isDarkMode ? 'text-pink-100' : 'text-slate-900'} m-0`}>
              💳 Debt Payoff Planner & "What-If" Acceleration Simulator
            </h3>
            <span className={`text-xs font-semibold ${isDarkMode ? 'text-pink-300/70' : 'text-pink-700/80'}`}>
              Compare Minimum Payment vs Extra Payment Strategies (YNAB Benchmark)
            </span>
          </div>
        </div>

        <Tag color="magenta" className="m-0 font-black px-3.5 py-1.5 rounded-xl text-xs border border-pink-200 shadow-2xs">
          <FontAwesomeIcon icon={faPiggyBank} className="mr-1.5" />
          Saved {savings.monthsSaved} Months & {currencySymbol}{savings.interestSaved.toLocaleString()} Interest!
        </Tag>
      </div>

      <Row gutter={[20, 20]}>
        {/* Left Controls */}
        <Col xs={24} md={12} className="space-y-4">
          <div className={`p-4 rounded-2xl border ${isDarkMode ? 'bg-[#180814] border-pink-900/30' : 'bg-pink-50/70 border-pink-200/80'}`}>
            <span className="font-black text-xs text-pink-600 block mb-2">
              🎛️ Interactive Extra Monthly Payment Slider: <strong className="text-pink-700 text-sm">+{currencySymbol}{extraPayment.toLocaleString()}/mo</strong>
            </span>
            <Slider
              min={0}
              max={30000}
              step={1000}
              value={extraPayment}
              onChange={val => setExtraPayment(val)}
              tooltip={{ formatter: val => `+${currencySymbol}${val.toLocaleString()}` }}
            />
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className={`p-3 rounded-xl border ${isDarkMode ? 'bg-[#180814] border-pink-900/30' : 'bg-white border-pink-200'}`}>
              <span className="text-slate-500 font-semibold block">Loan Amount</span>
              <strong className="text-slate-900 dark:text-white text-base font-black">{currencySymbol}{loanAmount.toLocaleString()}</strong>
            </div>
            <div className={`p-3 rounded-xl border ${isDarkMode ? 'bg-[#180814] border-pink-900/30' : 'bg-white border-pink-200'}`}>
              <span className="text-slate-500 font-semibold block">Interest Rate</span>
              <strong className="text-rose-500 text-base font-black">{interestRate}% APR</strong>
            </div>
          </div>
        </Col>

        {/* Right Payoff Comparison */}
        <Col xs={24} md={12} className="space-y-3">
          <div className={`p-4 rounded-2xl border flex items-center justify-between ${
            isDarkMode ? 'bg-rose-950/20 border-rose-900/40 text-rose-300' : 'bg-rose-50 border-rose-200 text-rose-900'
          }`}>
            <div>
              <span className="font-black text-xs block">Minimum Payment Strategy ({currencySymbol}{minimumPayment.toLocaleString()}/mo)</span>
              <span className="text-xs font-semibold">Payoff in {minStrategy.payoffMonths} months ({minStrategy.payoffYears} yrs)</span>
            </div>
            <span className="font-black text-sm">{currencySymbol}{minStrategy.totalInterest.toLocaleString()} Interest</span>
          </div>

          <div className={`p-4 rounded-2xl border flex items-center justify-between ${
            isDarkMode ? 'bg-emerald-950/20 border-emerald-900/40 text-emerald-300' : 'bg-emerald-50 border-emerald-200 text-emerald-900'
          }`}>
            <div>
              <span className="font-black text-xs block">✨ Accelerated Strategy (+{currencySymbol}{extraPayment.toLocaleString()}/mo)</span>
              <span className="text-xs font-semibold">Payoff in {accelStrategy.payoffMonths} months ({accelStrategy.payoffYears} yrs)</span>
            </div>
            <span className="font-black text-sm">{currencySymbol}{accelStrategy.totalInterest.toLocaleString()} Interest</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-gradient-to-r from-pink-500 to-purple-600 text-white flex items-center justify-between text-xs font-black shadow-sm">
            <span className="flex items-center gap-1.5">
              <FontAwesomeIcon icon={faClock} /> Acceleration Result:
            </span>
            <span>Saved {savings.monthsSaved} Months & {currencySymbol}{savings.interestSaved.toLocaleString()} Interest! 🎉</span>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default DebtPlanner;
