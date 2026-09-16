const express = require('express');
const router = express.Router();

const { calculateNetWorth, calculateSummary, calculateHealthScore } = require('../domain/financial/financialEngine');
const { generate30DayForecast } = require('../domain/financial/forecastService');
const { calculateDebtPayoff } = require('../domain/financial/debtService');
const { detectRecurringPatterns } = require('../domain/financial/recurringDetector');
const { processAIQuery } = require('../domain/financial/aiService');
const { getTransactions } = require('../controllers/transactions');

// Mock Accounts Data Store
const MOCK_ACCOUNTS = [
  { id: 'acc-1', name: 'Meezan Bank Account', type: 'BANK', balance: 220000, currency: 'PKR' },
  { id: 'acc-2', name: 'Easypaisa Mobile Wallet', type: 'SAVINGS', balance: 35000, currency: 'PKR' },
  { id: 'acc-3', name: 'HBL Credit Card', type: 'CREDIT', balance: -45000, currency: 'PKR' },
  { id: 'acc-4', name: 'Car Loan Installment', type: 'LOAN', balance: -150000, currency: 'PKR' }
];

// GET /api/financial/net-worth (Net Worth & 5-Month Growth History)
router.get('/net-worth', (req, res) => {
  const currency = req.query.currency || 'PKR';
  const data = calculateNetWorth(MOCK_ACCOUNTS, currency);
  
  res.json({
    accounts: MOCK_ACCOUNTS,
    ...data,
    history: [
      { month: 'Jan', netWorth: 420000 },
      { month: 'Feb', netWorth: 450000 },
      { month: 'Mar', netWorth: 470000 },
      { month: 'Apr', netWorth: 510000 },
      { month: 'May', netWorth: 560000 }
    ],
    growthPercent: '+33.3%'
  });
});

// GET /api/financial/forecast (30-Day Cash Flow Projection)
router.get('/forecast', (req, res) => {
  const currency = req.query.currency || 'PKR';
  const transactions = getTransactions();
  const summary = calculateSummary(transactions, currency);
  
  const forecast = generate30DayForecast({ currentBalance: summary.balance, transactions, currency });
  res.json(forecast);
});

// POST /api/financial/debt-planner (Loan Payoff Calculator)
router.post('/debt-planner', (req, res) => {
  const { loanAmount, annualInterestRate, minimumMonthlyPayment, extraMonthlyPayment, currency } = req.body;
  const result = calculateDebtPayoff({ loanAmount, annualInterestRate, minimumMonthlyPayment, extraMonthlyPayment, currency });
  res.json(result);
});

// GET /api/financial/recurring (Recurring Transaction Detection)
router.get('/recurring', (req, res) => {
  const transactions = getTransactions();
  const recurring = detectRecurringPatterns(transactions);
  res.json({ recurring });
});

// POST /api/financial/ai-query (AI Copilot Natural Language Q&A)
router.post('/ai-query', (req, res) => {
  const { query, currency } = req.body;
  const transactions = getTransactions();
  const summary = calculateSummary(transactions, currency || 'PKR');
  
  const result = processAIQuery({ query, summary, transactions, currency: currency || 'PKR' });
  res.json(result);
});

module.exports = router;
