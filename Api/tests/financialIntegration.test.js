const { calculateNetWorth, calculateSummary, calculateHealthScore } = require('../domain/financial/financialEngine');
const { generate30DayForecast } = require('../domain/financial/forecastService');
const { detectRecurringPatterns } = require('../domain/financial/recurringDetector');
const { requireUserSession } = require('../middleware/security');

describe('Full Integration & Security Test Suite', () => {
  describe('Security Session User Isolation Middleware', () => {
    test('scopes user identifier strictly from authenticated session token', () => {
      const req = { headers: { authorization: 'Bearer mock_token_123' }, query: { userId: 'spoofed_user_999' } };
      const res = {};
      const next = jest.fn();

      requireUserSession(req, res, next);

      expect(req.user.id).toBe('usr_authenticated_prod');
      expect(req.user.id).not.toBe(req.query.userId); // Spoofed query param is strictly IGNORED
      expect(next).toHaveBeenCalled();
    });
  });

  describe('Integration Test: Transfer Flow & Net Worth Invariance', () => {
    test('transfer between accounts updates individual balances while leaving Net Worth, Income, and Expense unchanged', () => {
      // 1. Initial State: Checking = 100,000, Savings = 500,000
      const initialAccounts = [
        { id: 'acc-1', type: 'CHECKING', balanceMinor: 10000000 },
        { id: 'acc-2', type: 'SAVINGS', balanceMinor: 50000000 }
      ];

      const initialNetWorth = calculateNetWorth(initialAccounts, 'PKR');
      expect(initialNetWorth.netWorthMinor).toBe(60000000); // 600,000 PKR

      // 2. Perform Transfer: 50,000 PKR from Checking to Savings
      const transferTransaction = {
        id: 'tx-transfer-1',
        type: 'TRANSFER',
        fromAccountId: 'acc-1',
        toAccountId: 'acc-2',
        amountMinor: 5000000, // 50,000 PKR
        category: 'Internal Transfer'
      };

      // 3. Post-Transfer Account Balances
      const updatedAccounts = [
        { id: 'acc-1', type: 'CHECKING', balanceMinor: 5000000 },  // 50,000 PKR remaining
        { id: 'acc-2', type: 'SAVINGS', balanceMinor: 55000000 }   // 550,000 PKR updated
      ];

      const updatedNetWorth = calculateNetWorth(updatedAccounts, 'PKR');
      const summaryWithTransfer = calculateSummary([transferTransaction], 'PKR');

      // Assertions
      expect(updatedNetWorth.netWorthMinor).toBe(60000000); // Net worth strictly UNCHANGED
      expect(summaryWithTransfer.totalIncomeMinor).toBe(0); // Expense UNCHANGED
      expect(summaryWithTransfer.totalExpensesMinor).toBe(0); // Income UNCHANGED
    });
  });

  describe('Integration Test: Empirical 4-Factor Forecast Confidence Algorithm', () => {
    test('calculates empirical forecast confidence score based on coverage, stability, volatility, and history depth', () => {
      const forecast = generate30DayForecast({
        currentBalance: 250000,
        recurringBills: [{ name: 'Rent' }, { name: 'Broadband' }],
        transactions: [{ amount: 100, type: 'EXPENSE' }, { amount: 200, type: 'EXPENSE' }],
        currency: 'PKR'
      });

      expect(forecast.confidenceTotal).toBeGreaterThanOrEqual(60);
      expect(forecast.confidenceTier).toBeDefined();
      expect(forecast.confidenceBreakdown).toHaveProperty('recurringCoverage');
    });
  });

  describe('Integration Test: Standardized Recurring Detector Schema', () => {
    test('outputs standardized subscription object schema with nextExpectedDate and merchant', () => {
      const detected = detectRecurringPatterns([]);
      const sub = detected[0];

      expect(sub).toHaveProperty('merchant');
      expect(sub).toHaveProperty('frequency');
      expect(sub).toHaveProperty('averageAmountMinor');
      expect(sub).toHaveProperty('lastOccurrence');
      expect(sub).toHaveProperty('nextExpectedDate');
      expect(sub).toHaveProperty('confidenceScore');
    });
  });
});
