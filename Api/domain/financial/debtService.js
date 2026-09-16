/**
 * Debt Payoff & Loan Acceleration Service
 * Compares Minimum Payment vs Extra Payment Strategy (YNAB Benchmark)
 */

const { toMinorUnits, fromMinorUnits } = require('./moneyUtils');

function calculateDebtPayoff({
  loanAmount = 500000,
  annualInterestRate = 18,
  minimumMonthlyPayment = 15000,
  extraMonthlyPayment = 5000,
  currency = 'PKR'
}) {
  const principal = Number(loanAmount) || 0;
  const monthlyRate = (Number(annualInterestRate) || 0) / 100 / 12;
  const minPay = Number(minimumMonthlyPayment) || 1;
  const totalMonthlyPay = minPay + (Number(extraMonthlyPayment) || 0);

  // Helper for payoff months
  function computePayoff(monthlyPayment) {
    if (monthlyPayment <= principal * monthlyRate) {
      return { months: 999, totalInterest: 9999999 }; // Payment too low to cover interest
    }

    let balance = principal;
    let months = 0;
    let totalInterest = 0;

    while (balance > 0 && months < 600) {
      const interestForMonth = balance * monthlyRate;
      totalInterest += interestForMonth;
      const principalPayment = Math.min(balance, monthlyPayment - interestForMonth);
      balance -= principalPayment;
      months++;
    }

    return { months, totalInterest: Math.round(totalInterest) };
  }

  const minResult = computePayoff(minPay);
  const extraResult = computePayoff(totalMonthlyPay);

  const monthsSaved = Math.max(0, minResult.months - extraResult.months);
  const interestSaved = Math.max(0, minResult.totalInterest - extraResult.totalInterest);

  return {
    principal,
    annualInterestRate,
    minimumMonthlyPayment: minPay,
    extraMonthlyPayment: Number(extraMonthlyPayment) || 0,
    totalMonthlyPayment: totalMonthlyPay,
    
    minimumStrategy: {
      payoffMonths: minResult.months,
      payoffYears: (minResult.months / 12).toFixed(1),
      totalInterest: minResult.totalInterest,
      totalPaid: principal + minResult.totalInterest
    },
    
    acceleratedStrategy: {
      payoffMonths: extraResult.months,
      payoffYears: (extraResult.months / 12).toFixed(1),
      totalInterest: extraResult.totalInterest,
      totalPaid: principal + extraResult.totalInterest
    },

    savings: {
      monthsSaved,
      yearsSaved: (monthsSaved / 12).toFixed(1),
      interestSaved
    }
  };
}

module.exports = {
  calculateDebtPayoff
};
