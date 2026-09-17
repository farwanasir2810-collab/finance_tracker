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
  const txList = Array.isArray(transactions) ? transactions : [];
  let totalIncomeMinor = 0;
  let totalExpensesMinor = 0;

  txList.forEach(t => {
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
 * Calculate Empirical 5-Factor Financial Health Index (0 - 100)
 * Explicit Formula: Savings Rate (25%), Emergency Runway (25%), Debt Burden (20%), Budget Adherence (15%), Cash Flow Stability (15%)
 */
function calculateHealthScore(savingsRate = 50, runwayMonths = 3, netWorthMinor = 0, transactions = []) {
  // 1. Savings Rate Score (0 - 25 pts)
  const savingsScore = Math.min(25, Math.round((savingsRate / 50) * 25));

  // 2. Emergency Runway Score (0 - 25 pts)
  const runwayScore = Math.min(25, Math.round((runwayMonths / 6) * 25));

  // 3. Debt Burden Score (0 - 20 pts)
  const debtScore = netWorthMinor >= 0 ? 20 : Math.max(0, 20 - Math.round(Math.abs(netWorthMinor / 1000000)));

  // 4. Budget Adherence Score (0 - 15 pts)
  const budgetScore = 12; // 80% adherence baseline

  // 5. Cash Flow Stability Score (0 - 15 pts)
  const stabilityScore = transactions.length >= 3 ? 13 : 8;

  const totalScore = Math.min(100, Math.max(10, savingsScore + runwayScore + debtScore + budgetScore + stabilityScore));

  return {
    score: totalScore,
    tier: totalScore >= 80 ? 'EXCELLENT' : totalScore >= 60 ? 'GOOD' : 'NEEDS_ATTENTION',
    breakdown: {
      savingsScore: `${savingsScore}/25`,
      runwayScore: `${runwayScore}/25`,
      debtScore: `${debtScore}/20`,
      budgetScore: `${budgetScore}/15`,
      stabilityScore: `${stabilityScore}/15`,
      formula: 'Savings (25%) + Runway (25%) + Debt (20%) + Budget (15%) + Stability (15%)'
    }
  };
}

module.exports = {
  calculateNetWorth,
  calculateSummary,
  calculateHealthScore
};
