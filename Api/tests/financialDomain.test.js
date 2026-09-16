const { toMinorUnits, fromMinorUnits, formatMoney, convertCurrency } = require('../domain/financial/moneyUtils');
const { calculateNetWorth, calculateSummary, calculateHealthScore } = require('../domain/financial/financialEngine');
const { calculateDebtPayoff } = require('../domain/financial/debtService');
const { generate30DayForecast } = require('../domain/financial/forecastService');
const { processAIQuery } = require('../domain/financial/aiService');

describe('Financial Domain Engine Unit Tests', () => {
  describe('Money Utils (Minor Unit Math)', () => {
    test('converts major units to minor units (paisa/cents)', () => {
      expect(toMinorUnits(12.50)).toBe(1250);
      expect(toMinorUnits(100)).toBe(10000);
      expect(toMinorUnits(0.99)).toBe(99);
    });

    test('converts minor units back to major units', () => {
      expect(fromMinorUnits(1250)).toBe(12.5);
      expect(fromMinorUnits(10000)).toBe(100);
    });

    test('formats money properly with currency symbols', () => {
      expect(formatMoney(125000, 'PKR')).toContain('1,250');
      expect(formatMoney(10000, 'USD')).toContain('100.00');
    });

    test('converts currencies correctly', () => {
      const converted = convertCurrency(10000, 'USD', 'PKR'); // 100 USD = 27800 PKR in minor units
      expect(converted).toBeGreaterThan(10000);
    });
  });

  describe('Financial Engine', () => {
    const transactions = [
      { type: 'INCOME', amountMinor: 25000000, category: 'Salary' },
      { type: 'EXPENSE', amountMinor: 5000000, category: 'Rent' },
      { type: 'EXPENSE', amountMinor: 2000000, category: 'Groceries' },
      { type: 'TRANSFER', amountMinor: 1000000, category: 'Savings Transfer' } // Internal transfer - EXCLUDED
    ];

    const accounts = [
      { type: 'checking', balanceMinor: 18000000 },
      { type: 'savings', balanceMinor: 50000000 },
      { type: 'investment', balanceMinor: 30000000 },
      { type: 'credit', balanceMinor: 5000000 }
    ];

    test('calculates Cash Flow & Summary correctly excluding internal transfers', () => {
      const summary = calculateSummary(transactions, 'PKR');
      expect(summary.totalIncomeMinor).toBe(25000000);
      expect(summary.totalExpensesMinor).toBe(7000000);
      expect(summary.balanceMinor).toBe(18000000);
      expect(summary.savingsRate).toBe(72);
    });

    test('calculates Net Worth separating liquid assets and liabilities', () => {
      const netWorth = calculateNetWorth(accounts, 'PKR');
      expect(netWorth.totalAssetsMinor).toBe(98000000);
      expect(netWorth.totalLiabilitiesMinor).toBe(5000000);
      expect(netWorth.netWorthMinor).toBe(93000000);
    });

    test('calculates Financial Health Score out of 100', () => {
      const health = calculateHealthScore(72, 28, 93000000, transactions);
      expect(health.score).toBeGreaterThanOrEqual(30);
      expect(health.breakdown).toBeDefined();
    });
  });

  describe('Debt Payoff Service', () => {
    test('simulates extra payment accelerating loan payoff', () => {
      const result = calculateDebtPayoff({
        loanAmount: 500000,
        annualInterestRate: 18,
        minimumMonthlyPayment: 15000,
        extraMonthlyPayment: 5000,
        currency: 'PKR'
      });
      expect(result.minimumStrategy.payoffMonths).toBeGreaterThan(result.acceleratedStrategy.payoffMonths);
      expect(result.savings.interestSaved).toBeGreaterThan(0);
    });
  });

  describe('30-Day Cash Flow Forecast', () => {
    test('generates waterfall timeline with confidence rating', () => {
      const forecast = generate30DayForecast({
        currentBalance: 250000,
        recurringBills: [{ name: 'Rent' }, { name: 'Gym' }],
        transactions: [],
        currency: 'PKR'
      });

      expect(forecast.timeline.length).toBeGreaterThan(0);
      expect(forecast.confidenceScore).toBeDefined();
    });
  });

  describe('AI Copilot Domain Engine', () => {
    test('parses intent and provides response with math breakdown', () => {
      const res = processAIQuery({
        query: 'Can I afford a 1200 laptop?',
        summary: { balance: 2500, totalIncome: 5000, totalExpenses: 1200 },
        transactions: [],
        currency: 'USD'
      });

      expect(res.intent).toBe('AFFORDABILITY_CHECK');
      expect(res.explanation).toBeDefined();
      expect(res.calculation).toBeDefined();
    });
  });
});
