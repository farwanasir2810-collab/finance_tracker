/**
 * Central Financial Engine Domain Service
 * Authoritative Backend Financial Calculation Logic
 */

const { toMinorUnits, fromMinorUnits, convertCurrency } = require('./moneyUtils');

/**
 * Calculate net worth from accounts (Assets - Liabilities = Net Worth)
 * Property Invariant: TRANSFER between accounts does NOT alter Net Worth
 */
function calculateNetWorth(accounts = [], targetCurrency = 'PKR') {
  let totalAssetsMinor = 0;
  let totalLiabilitiesMinor = 0;

  accounts.forEach(acc => {
    const balanceMinor = acc.balanceMinor || toMinorUnits(acc.balance || 0, acc.currency || 'PKR');
    const convertedMinor = convertCurrency(balanceMinor, acc.currency || 'PKR', targetCurrency);

    const typeUpper = (acc.type || '').toUpperCase();
    if (typeUpper === 'CREDIT' || typeUpper === 'LOAN' || typeUpper === 'LIABILITY') {
      totalLiabilitiesMinor += Math.abs(convertedMinor);
    } else {
      totalAssetsMinor += convertedMinor;
    }
  });

  const netWorthMinor = totalAssetsMinor - totalLiabilitiesMinor;

  return {
    totalAssetsMinor,
    totalLiabilitiesMinor,
    netWorthMinor,
    totalAssets: fromMinorUnits(totalAssetsMinor, targetCurrency),
    totalLiabilities: fromMinorUnits(totalLiabilitiesMinor, targetCurrency),
    netWorth: fromMinorUnits(netWorthMinor, targetCurrency)
  };
}

/**
 * Calculate Period Summary (Inflow, Outflow, Balance, Savings Rate)
 * Ignores 'TRANSFER' transaction type to keep financial metrics 100% consistent
 */
function calculateSummary(transactions = [], targetCurrency = 'PKR') {
  let totalIncomeMinor = 0;
  let totalExpensesMinor = 0;

  transactions.forEach(t => {
    if (t.type === 'TRANSFER') return; // Ignore internal transfers

    const rawMinor = t.amountMinor || toMinorUnits(t.amount || 0, t.currency || 'PKR');
    const convertedMinor = convertCurrency(rawMinor, t.currency || 'PKR', targetCurrency, t.exchangeRate);

    if (t.type === 'INCOME') {
      totalIncomeMinor += convertedMinor;
    } else if (t.type === 'EXPENSE') {
      totalExpensesMinor += convertedMinor;
    } else if (t.type === 'REFUND') {
      totalExpensesMinor -= convertedMinor; // Refunds reduce expenses
    }
  });

  const balanceMinor = totalIncomeMinor - totalExpensesMinor;
  const savingsRate = totalIncomeMinor > 0 
    ? Math.max(0, Math.min(100, Math.round(((totalIncomeMinor - totalExpensesMinor) / totalIncomeMinor) * 100))) 
    : 0;

  return {
    totalIncomeMinor,
    totalExpensesMinor,
    balanceMinor,
    totalIncome: fromMinorUnits(totalIncomeMinor, targetCurrency),
    totalExpenses: fromMinorUnits(totalExpensesMinor, targetCurrency),
    balance: fromMinorUnits(balanceMinor, targetCurrency),
    savingsRate
  };
}

/**
 * Calculate Weighted Financial Stability Score (0 - 100)
 * Weighted Breakdown: Savings Rate (30%), Expense Ratio (30%), Runway Cushion (20%), Logging Frequency (20%)
 */
function calculateHealthScore(summary, runwayMonths = 3, transactionCount = 0) {
  const { totalIncome = 0, totalExpenses = 0, savingsRate = 0 } = summary;

  // 1. Savings Rate Score (0-30 pts)
  const savingsScore = Math.min(30, Math.round((savingsRate / 30) * 30));

  // 2. Expense Ratio Score (0-30 pts)
  const expenseRatio = totalIncome > 0 ? (totalExpenses / totalIncome) * 100 : 100;
  let ratioScore = 0;
  if (expenseRatio <= 50) ratioScore = 30;
  else if (expenseRatio <= 75) ratioScore = 20;
  else if (expenseRatio <= 95) ratioScore = 10;

  // 3. Runway Cushion Score (0-20 pts)
  const runwayScore = Math.min(20, Math.round((runwayMonths / 6) * 20));

  // 4. Activity Score (0-20 pts)
  const activityScore = Math.min(20, transactionCount * 4);

  const totalScore = Math.min(100, Math.max(10, savingsScore + ratioScore + runwayScore + activityScore));

  return {
    score: totalScore,
    savingsScore,
    ratioScore,
    runwayScore,
    activityScore,
    breakdown: {
      savingsWeight: '30%',
      expenseRatioWeight: '30%',
      runwayWeight: '20%',
      activityWeight: '20%'
    }
  };
}

module.exports = {
  calculateNetWorth,
  calculateSummary,
  calculateHealthScore
};
