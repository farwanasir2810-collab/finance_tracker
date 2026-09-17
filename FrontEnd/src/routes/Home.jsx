import { useState, useEffect, useCallback } from 'react';
import { ConfigProvider, Table, Button, Tag, Space, Input, Popconfirm, message, DatePicker, Segmented, Modal, Select, Drawer, theme as antTheme } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faPlus,
  faPenToSquare,
  faTrash,
  faMagnifyingGlass,
  faArrowsRotate,
  faFileCsv,
  faChartPie,
  faListCheck,
  faHeart,
  faCircleQuestion,
  faWandMagicSparkles,
  faMoon,
  faSun,
  faCoins,
  faPiggyBank,
  faRepeat,
  faSeedling,
  faBrain,
  faGaugeHigh,
  faStar,
  faTableList,
  faSmileBeam,
  faCrown,
  faUpload,
  faCalendarDays,
  faVault,
  faCreditCard,
  faGear
} from '@fortawesome/free-solid-svg-icons';
import dayjs from 'dayjs';

import SummaryCards from '../components/transactions/SummaryCards';
import CategoryAnalytics, { getCategoryMeta } from '../components/transactions/CategoryAnalytics';
import TransactionModal from '../components/transactions/TransactionModal';
import QuickAddPresets from '../components/transactions/QuickAddPresets';
import BudgetMeter from '../components/transactions/BudgetMeter';
import AchievementBadges from '../components/transactions/AchievementBadges';
import FinancialAnalyticsChart from '../components/transactions/FinancialAnalyticsChart';
import FinancialHealthScore from '../components/transactions/FinancialHealthScore';
import SavingsGoals from '../components/transactions/SavingsGoals';
import RecurringSubscriptions from '../components/transactions/RecurringSubscriptions';
import WealthGrowthCalculator from '../components/transactions/WealthGrowthCalculator';
import EmergencyRunway from '../components/transactions/EmergencyRunway';
import AIAdvisor from '../components/transactions/AIAdvisor';
import SpendingMoodTracker from '../components/transactions/SpendingMoodTracker';
import RecruiterSpotlightModal from '../components/transactions/RecruiterSpotlightModal';

// New Production Financial OS Components
import AICopilot from '../components/ai/AICopilot';
import CashFlowTimeline from '../components/forecasting/CashFlowTimeline';
import NetWorthTracker from '../components/networth/NetWorthTracker';
import DebtPlanner from '../components/debt/DebtPlanner';
import FinancialCalendar from '../components/calendar/FinancialCalendar';
import CSVImportModal from '../components/transactions/CSVImportModal';
import SpendingBehaviorTracker from '../components/behavior/SpendingBehaviorTracker';

import {
  fetchTransactions,
  createTransaction,
  updateTransaction,
  deleteTransaction
} from '../helpers/transactionApi';

const { RangePicker } = DatePicker;
const { Option } = Select;

const CURRENCIES = {
  USD: { symbol: '$', rate: 1 },
  EUR: { symbol: '€', rate: 0.92 },
  GBP: { symbol: '£', rate: 0.79 },
  PKR: { symbol: 'Rs ', rate: 278.5 }
};

const renderPaginationTotal = total => (
  <span className="font-extrabold text-pink-500 text-xs">Total {total} transaction records logged ✨</span>
);

const SAMPLE_ENTRIES = [
  { type: 'income', amount: 3500, category: 'Salary', description: 'Monthly Engineer Salary Payout', date: dayjs().toISOString() },
  { type: 'expense', amount: 45, category: 'Groceries', description: 'Zara Shopping & Fashion Haul', date: dayjs().subtract(1, 'day').toISOString() },
  { type: 'expense', amount: 15, category: 'Food', description: 'Matcha Latte & Bakery Treats', date: dayjs().subtract(2, 'day').toISOString() },
  { type: 'expense', amount: 35, category: 'Healthcare', description: 'Skincare & Spa Self Care', date: dayjs().subtract(3, 'day').toISOString() },
  { type: 'income', amount: 450, category: 'Freelance', description: 'UI Design Freelance Client', date: dayjs().subtract(4, 'day').toISOString() }
];

const Home = () => {
  const [loading, setLoading] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [summary, setSummary] = useState({ totalIncome: 0, totalExpenses: 0, balance: 0 });

  // Workspace Navigation Tab State
  const [activeWorkspaceKey, setActiveWorkspaceKey] = useState('overview');

  // Theme & Currency Customization
  const [currencyKey, setCurrencyKey] = useState('PKR');
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Filters
  const [filterType, setFilterType] = useState('all');
  const [searchCategory, setSearchCategory] = useState('');
  const [dateRange, setDateRange] = useState(null);

  // Modals
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isSpotlightOpen, setIsSpotlightOpen] = useState(false);
  const [isMoreMobileOpen, setIsMoreMobileOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);

  const currency = CURRENCIES[currencyKey] || CURRENCIES.PKR;

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      if (filterType !== 'all') params.type = filterType;
      if (searchCategory.trim()) params.category = searchCategory.trim();
      if (dateRange && dateRange[0] && dateRange[1]) {
        params.startDate = dateRange[0].startOf('day').toISOString();
        params.endDate = dateRange[1].endOf('day').toISOString();
      }

      const res = await fetchTransactions(params);
      setTransactions(res.transactions || []);
      setSummary(res.summary || { totalIncome: 0, totalExpenses: 0, balance: 0 });
    } catch (err) {
      message.error(err.response?.data?.message || 'Failed to load transactions');
    } finally {
      setLoading(false);
    }
  }, [filterType, searchCategory, dateRange]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleOpenAddModal = () => {
    setEditingTransaction(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = record => {
    setEditingTransaction(record);
    setIsModalOpen(true);
  };

  const handleModalSubmit = async formData => {
    setModalLoading(true);
    try {
      if (editingTransaction) {
        await updateTransaction(editingTransaction.id, formData);
        message.success('Transaction updated successfully! ✨');
      } else {
        await createTransaction(formData);
        message.success('Transaction logged successfully! 💖');
      }
      setIsModalOpen(false);
      setEditingTransaction(null);
      loadData();
    } catch (err) {
      message.error(err.response?.data?.message || 'Failed to save transaction');
    } finally {
      setModalLoading(false);
    }
  };

  const handleDelete = async id => {
    try {
      await deleteTransaction(id);
      message.success('Transaction deleted successfully!');
      loadData();
    } catch (err) {
      message.error(err.response?.data?.message || 'Failed to delete transaction');
    }
  };

  const handleClearFilters = () => {
    setFilterType('all');
    setSearchCategory('');
    setDateRange(null);
    message.info('All filters cleared!');
  };

  const handleLoadSampleData = async () => {
    setLoading(true);
    try {
      for (const sample of SAMPLE_ENTRIES) {
        await createTransaction(sample);
      }
      message.success('Sample demo data loaded! ✨');
      loadData();
    } catch (err) {
      message.error('Failed to load sample data');
    } finally {
      setLoading(false);
    }
  };

  const exportToCSV = () => {
    if (!transactions.length) {
      message.warning('No transactions available to export');
      return;
    }

    const headers = ['ID', 'Type', 'Category', 'Description', 'Amount', 'Date'];
    const rows = transactions.map(t => [
      t.id,
      t.type,
      `"${t.category || ''}"`,
      `"${(t.description || '').replace(/"/g, '""')}"`,
      (t.amount * currency.rate).toFixed(2),
      dayjs(t.date).format('YYYY-MM-DD')
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Finora_${currencyKey}_${dayjs().format('YYYYMMDD_HHmmss')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    message.success(`Ledger exported in ${currencyKey}! ✨`);
  };

  const convertedSummary = {
    totalIncome: (summary?.totalIncome || 0) * (currency?.rate || 1),
    totalExpenses: (summary?.totalExpenses || 0) * (currency?.rate || 1),
    balance: (summary?.balance || 0) * (currency?.rate || 1)
  };

  const columns = [
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      width: 130,
      render: type =>
        type === 'income' ? (
          <span className="px-3 py-1 text-xs font-black rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-500 uppercase tracking-wider inline-flex items-center gap-1">
            ▲ Inflow
          </span>
        ) : (
          <span className="px-3 py-1 text-xs font-black rounded-xl border border-pink-500/30 bg-pink-500/10 text-pink-500 uppercase tracking-wider inline-flex items-center gap-1">
            ▼ Outflow
          </span>
        )
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
      render: text => {
        const meta = getCategoryMeta(text);
        return (
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-2xl flex items-center justify-center text-sm shadow-xs border border-white/10"
              style={{ backgroundColor: meta.bg, color: meta.color }}
            >
              <FontAwesomeIcon icon={meta.icon} />
            </div>
            <span className={`font-black text-sm ${isDarkMode ? 'text-pink-100' : 'text-slate-900'}`}>{text}</span>
          </div>
        );
      }
    },
    {
      title: 'Description / Notes',
      dataIndex: 'description',
      key: 'description',
      render: text => <span className={`font-semibold text-sm ${isDarkMode ? 'text-pink-300/70' : 'text-slate-600'}`}>{text || '-'}</span>
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      width: 140,
      sorter: (a, b) => new Date(a.date) - new Date(b.date),
      render: date => <span className={`font-extrabold text-xs ${isDarkMode ? 'text-pink-300/60' : 'text-slate-500'}`}>{dayjs(date).format('MMM DD, YYYY')}</span>
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      align: 'right',
      width: 170,
      sorter: (a, b) => a.amount - b.amount,
      render: (amount, record) => {
        const isIncome = record.type === 'income';
        const converted = Number(amount) * currency.rate;
        return (
          <span className={`font-black text-base tracking-tight ${isIncome ? 'text-emerald-500' : 'text-pink-500'}`}>
            {isIncome ? '+' : '-'}{currency.symbol}{converted.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
        );
      }
    },
    {
      title: 'Actions',
      key: 'actions',
      align: 'center',
      width: 110,
      render: (_, record) => (
        <Space size="small">
          <Button
            type="text"
            className="hover:bg-pink-500/20 rounded-xl text-pink-500 font-bold"
            icon={<FontAwesomeIcon icon={faPenToSquare} />}
            onClick={() => handleOpenEditModal(record)}
            title="Edit"
          />
          <Popconfirm
            title="Delete transaction?"
            description="Are you sure you want to remove this record?"
            onConfirm={() => handleDelete(record.id)}
            okText="Yes, Delete"
            cancelText="Cancel"
            okButtonProps={{ danger: true }}
          >
            <Button
              type="text"
              danger
              className="hover:bg-rose-500/20 rounded-xl text-pink-500 font-bold"
              icon={<FontAwesomeIcon icon={faTrash} />}
              title="Delete"
            />
          </Popconfirm>
        </Space>
      )
    }
  ];

  const hasActiveFilters = filterType !== 'all' || searchCategory.trim() !== '' || dateRange !== null;

  return (
    <ConfigProvider
      theme={{
        algorithm: isDarkMode ? antTheme.darkAlgorithm : antTheme.defaultAlgorithm,
        token: {
          colorPrimary: '#ec4899',
          colorBgContainer: isDarkMode ? '#240c1e' : '#ffffff',
          borderRadius: 20,
          fontFamily: 'Plus Jakarta Sans, sans-serif'
        }
      }}
    >
      <div className={`min-h-screen ${isDarkMode ? 'bg-[#180715] text-pink-100' : 'bg-gradient-to-br from-pink-50 via-purple-50/50 to-rose-50 text-slate-900'} p-3 sm:p-4 md:p-8 pb-24 md:pb-8 font-sans antialiased transition-colors duration-300 flex flex-col justify-between`}>
        <div className="max-w-7xl mx-auto space-y-6 w-full">

          {/* Clean 3-Layer Sequenced Header Navigation Hub */}
          <header role="banner" className={`rounded-3xl border transition-all duration-300 overflow-hidden ${
            isDarkMode
              ? 'bg-[#240c1e] border-pink-900/40 shadow-2xl shadow-pink-950/50'
              : 'bg-white/95 backdrop-blur-md border-pink-200/80 shadow-xl shadow-pink-100/70'
          }`}>
            <div className="p-6 space-y-5">
              
              {/* Layer 1: Brand & Action Controls Toolbar */}
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                
                {/* Brand Identity */}
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-3xl bg-gradient-to-tr from-pink-500 via-rose-400 to-purple-500 text-white flex items-center justify-center text-2xl font-black shadow-lg shadow-pink-500/30 ring-4 ring-pink-400/20">
                    <FontAwesomeIcon icon={faWandMagicSparkles} />
                  </div>
                  <div>
                    <div className="flex items-center gap-3">
                      <h1 className={`text-3xl md:text-4xl font-black tracking-tight bg-clip-text text-transparent m-0 ${
                        isDarkMode ? 'bg-gradient-to-r from-pink-300 via-rose-300 to-fuchsia-300' : 'bg-gradient-to-r from-pink-600 via-rose-500 to-purple-600'
                      }`}>
                        Finora
                      </h1>
                      <span className={`flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-black border ${
                        isDarkMode ? 'bg-pink-500/20 text-pink-300 border-pink-500/30' : 'bg-pink-100 text-pink-700 border-pink-300/80'
                      }`}>
                        <span className="w-2.5 h-2.5 rounded-full bg-pink-500 animate-pulse"></span>
                        FINORA PRO
                      </span>
                    </div>
                    <span className={`mt-1 flex items-center gap-2 text-xs font-extrabold ${isDarkMode ? 'text-pink-300/70' : 'text-pink-700/80'}`}>
                      <FontAwesomeIcon icon={faCrown} className="text-pink-500" />
                      Track. Understand. Plan. Grow. • {dayjs().format('dddd, MMMM D, YYYY')}
                    </span>
                  </div>
                </div>

                {/* Right Sequenced Action Toolbar */}
                <div className="flex flex-wrap items-center gap-2.5">
                  {/* 1. Currency Switcher */}
                  <Select
                    value={currencyKey}
                    onChange={val => setCurrencyKey(val)}
                    className="w-32 font-black rounded-2xl h-11"
                    suffixIcon={<FontAwesomeIcon icon={faCoins} className="text-amber-400" />}
                  >
                    <Option value="PKR">PKR (Rs)</Option>
                    <Option value="USD">USD ($)</Option>
                    <Option value="EUR">EUR (€)</Option>
                    <Option value="GBP">GBP (£)</Option>
                  </Select>

                  {/* 2. Theme Mode Toggle */}
                  <Button
                    onClick={() => setIsDarkMode(!isDarkMode)}
                    icon={<FontAwesomeIcon icon={isDarkMode ? faSun : faMoon} className={isDarkMode ? 'text-amber-400' : 'text-pink-600'} />}
                    className={`h-11 px-4 rounded-2xl font-black border flex items-center gap-2 transition-all ${
                      isDarkMode
                        ? 'bg-[#180814] border-pink-900/40 text-pink-200 hover:border-pink-500'
                        : 'bg-pink-50 border-pink-200 text-pink-900 hover:bg-pink-100 shadow-xs'
                    }`}
                  >
                    {isDarkMode ? 'Soft Mode 🌸' : 'Cozy Dark 🌙'}
                  </Button>

                  {/* 3. Bank CSV Import */}
                  <Button
                    icon={<FontAwesomeIcon icon={faUpload} className="text-purple-500" />}
                    onClick={() => setIsImportOpen(true)}
                    className={`h-11 px-4 rounded-2xl font-black border flex items-center gap-2 transition-all ${
                      isDarkMode
                        ? 'bg-purple-950/40 border-purple-800/50 text-purple-300 hover:bg-purple-900/60'
                        : 'bg-purple-50 border-purple-200 text-purple-900 hover:bg-purple-100 shadow-xs'
                    }`}
                  >
                    Import CSV 📥
                  </Button>

                  {/* 4. Export CSV Button */}
                  <Button
                    icon={<FontAwesomeIcon icon={faFileCsv} className={isDarkMode ? 'text-pink-300' : 'text-slate-700'} />}
                    onClick={exportToCSV}
                    className={`h-11 px-4 rounded-2xl font-black border flex items-center gap-2 transition-all ${
                      isDarkMode
                        ? 'bg-[#180814] border-pink-900/40 text-pink-200 hover:bg-pink-950/60'
                        : 'bg-slate-100/90 border-slate-200 text-slate-800 hover:bg-slate-200 shadow-xs'
                    }`}
                  >
                    Export CSV
                  </Button>

                  {/* 5. Primary CTA: Log Entry */}
                  <Button
                    type="primary"
                    icon={<FontAwesomeIcon icon={faPlus} />}
                    onClick={handleOpenAddModal}
                    className="h-11 px-6 bg-gradient-to-r from-pink-500 via-rose-500 to-purple-500 hover:from-pink-600 hover:to-rose-600 text-white font-black rounded-2xl shadow-lg shadow-pink-500/30 border-0 flex items-center gap-2 transition-all hover:scale-105"
                  >
                    + Log Entry 💖
                  </Button>
                </div>
              </div>

              {/* Layer 2: Live Status & Sync Ticker Ribbon */}
              <div className={`p-3.5 rounded-2xl border flex flex-wrap items-center justify-between gap-3 text-xs ${
                isDarkMode ? 'bg-[#180814]/80 border-pink-900/30' : 'bg-pink-50/80 border-pink-200/60'
              }`}>
                <div className="flex flex-wrap items-center gap-4">
                  <span className="flex items-center gap-1.5 font-black text-emerald-600">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                    Last synced: 2 minutes ago
                  </span>
                  <span className="text-pink-400">|</span>
                  <span className={`font-bold ${isDarkMode ? 'text-pink-200' : 'text-slate-700'}`}>
                    📊 Total Logged: <strong className="text-pink-500">{transactions?.length || 0} Entries</strong>
                  </span>
                  <span className="text-pink-400">|</span>
                  <span className={`font-bold ${isDarkMode ? 'text-pink-200' : 'text-slate-700'}`}>
                    💖 Vault Balance: <strong className="text-emerald-500">{currency?.symbol || '$'}{((summary?.balance || 0) * (currency?.rate || 1)).toFixed(2)}</strong>
                  </span>
                </div>

                <Button
                  size="small"
                  onClick={handleLoadSampleData}
                  loading={loading}
                  icon={<FontAwesomeIcon icon={faWandMagicSparkles} className="text-pink-500" />}
                  className="bg-pink-100 text-pink-700 border border-pink-300 font-black rounded-xl text-xs px-3 py-1 hover:scale-105 transition-all"
                >
                  Load Demo Data ✨
                </Button>
              </div>

              {/* Layer 3: Sequenced Navigation Navbar Tabs */}
              <nav aria-label="Desktop Workspace Navigation" className="pt-2 flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
                {[
                  { key: 'overview', label: '🌸 Overview', icon: faGaugeHigh },
                  { key: 'ai', label: '🧠 AI Copilot', icon: faBrain },
                  { key: 'forecast', label: '🔮 Cash-Flow Forecast', icon: faWandMagicSparkles },
                  { key: 'networth', label: '💰 Net Worth', icon: faVault },
                  { key: 'debt', label: '💳 Debt Planner', icon: faCreditCard },
                  { key: 'calendar', label: '📅 Money Calendar', icon: faCalendarDays },
                  { key: 'ledger', label: '📋 Audit Ledger', icon: faTableList, count: transactions?.length || 0 },
                  { key: 'goals', label: '💖 Wishlists', icon: faPiggyBank },
                  { key: 'subscriptions', label: '🔄 Subscriptions', icon: faRepeat }
                ].map(nav => (
                  <button
                    key={nav.key}
                    onClick={() => setActiveWorkspaceKey(nav.key)}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl font-black text-xs shrink-0 transition-all ${
                      activeWorkspaceKey === nav.key
                        ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-md shadow-pink-500/30 border-0 scale-105 ring-2 ring-pink-400/40'
                        : isDarkMode
                        ? 'bg-[#180814] text-pink-200/80 border border-pink-900/30 hover:border-pink-700/50 hover:text-white'
                        : 'bg-pink-100/70 text-pink-900 border border-pink-200/80 hover:bg-pink-200/80 font-black shadow-xs'
                    }`}
                  >
                    <FontAwesomeIcon icon={nav.icon} />
                    <span>{nav.label}</span>
                    {nav.count !== undefined && (
                      <span className="px-2 py-0.5 rounded-lg bg-white/25 text-[10px] font-black">
                        {nav.count}
                      </span>
                    )}
                  </button>
                ))}
              </nav>

            </div>
          </header>

          <main role="main" className="space-y-6">

          {/* Gamified Milestones & Badges Ribbon */}
          <AchievementBadges summary={convertedSummary} transactionCount={transactions?.length || 0} isDarkMode={isDarkMode} />

          {/* Hero Financial Summary Stat Grid */}
          <SummaryCards
            summary={convertedSummary}
            activeFilter={filterType}
            onSelectFilter={type => {
              setFilterType(type);
              setActiveWorkspaceKey('ledger');
            }}
            currencySymbol={currency.symbol}
            isDarkMode={isDarkMode}
          />

          {/* SECTION 1: OVERVIEW DASHBOARD */}
          {activeWorkspaceKey === 'overview' && (
            <div className="space-y-6">
              <AICopilot summary={convertedSummary} isDarkMode={isDarkMode} currencySymbol={currency.symbol} />
              <CashFlowTimeline isDarkMode={isDarkMode} currencySymbol={currency.symbol} />
              <NetWorthTracker isDarkMode={isDarkMode} currencySymbol={currency.symbol} />
              <SpendingBehaviorTracker isDarkMode={isDarkMode} />
              <AIAdvisor summary={convertedSummary} transactions={transactions} isDarkMode={isDarkMode} />
              <FinancialHealthScore summary={convertedSummary} transactions={transactions} isDarkMode={isDarkMode} />
              <FinancialAnalyticsChart summary={convertedSummary} currencySymbol={currency.symbol} isDarkMode={isDarkMode} />
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <QuickAddPresets onSuccess={loadData} isDarkMode={isDarkMode} />
                <BudgetMeter totalExpenses={convertedSummary.totalExpenses} isDarkMode={isDarkMode} />
                <EmergencyRunway summary={convertedSummary} isDarkMode={isDarkMode} />
              </div>
            </div>
          )}

          {/* SECTION 2: AI COPILOT HERO WORKSPACE */}
          {activeWorkspaceKey === 'ai' && (
            <AICopilot summary={convertedSummary} isDarkMode={isDarkMode} currencySymbol={currency.symbol} />
          )}

          {/* SECTION 3: CASH-FLOW FORECAST TIMELINE */}
          {activeWorkspaceKey === 'forecast' && (
            <CashFlowTimeline isDarkMode={isDarkMode} currencySymbol={currency.symbol} />
          )}

          {/* SECTION 4: NET WORTH TRACKER */}
          {activeWorkspaceKey === 'networth' && (
            <NetWorthTracker isDarkMode={isDarkMode} currencySymbol={currency.symbol} />
          )}

          {/* SECTION 5: DEBT PAYOFF PLANNER */}
          {activeWorkspaceKey === 'debt' && (
            <DebtPlanner isDarkMode={isDarkMode} currencySymbol={currency.symbol} />
          )}

          {/* SECTION 6: MONEY CALENDAR */}
          {activeWorkspaceKey === 'calendar' && (
            <FinancialCalendar isDarkMode={isDarkMode} currencySymbol={currency.symbol} />
          )}

          {/* SECTION 7: TRANSACTIONS AUDIT LEDGER */}
          {activeWorkspaceKey === 'ledger' && (
            <div className="space-y-4">
              {/* Search, Date & Type Filter Toolbar */}
              <div className={`p-6 rounded-3xl border transition-all duration-300 backdrop-blur-md shadow-md ${
                isDarkMode ? 'bg-[#240c1e]/90 border-pink-900/40 shadow-pink-950/20' : 'bg-white/95 border-pink-200/80 shadow-pink-100/70'
              }`}>
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="flex flex-wrap items-center gap-3">
                    <Segmented
                      size="large"
                      value={filterType}
                      onChange={value => setFilterType(value)}
                      options={[
                        { label: <span className="font-black px-3">ALL ENTRIES</span>, value: 'all' },
                        { label: <span className="font-black text-emerald-500 px-3">💰 INFLOW</span>, value: 'income' },
                        { label: <span className="font-black text-pink-500 px-3">💸 OUTFLOW</span>, value: 'expense' }
                      ]}
                      className={isDarkMode ? 'bg-[#180814] text-pink-200 font-black p-1 rounded-2xl' : 'bg-pink-100/80 text-pink-900 font-black p-1 rounded-2xl border border-pink-200/60'}
                    />

                    <Input
                      placeholder="Search category..."
                      prefix={<FontAwesomeIcon icon={faMagnifyingGlass} className="text-pink-500/70" />}
                      value={searchCategory}
                      onChange={e => setSearchCategory(e.target.value)}
                      style={{ width: 190 }}
                      size="large"
                      className="rounded-2xl h-11 font-semibold"
                      allowClear
                    />

                    <RangePicker
                      value={dateRange}
                      onChange={dates => setDateRange(dates)}
                      size="large"
                      className="rounded-2xl h-11 font-semibold"
                      format="YYYY-MM-DD"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    {hasActiveFilters && (
                      <Button
                        danger
                        type="dashed"
                        icon={<FontAwesomeIcon icon={faArrowsRotate} />}
                        onClick={handleClearFilters}
                        size="large"
                        className="rounded-2xl font-black h-11"
                      >
                        Clear Filters
                      </Button>
                    )}
                    <Button
                      icon={<FontAwesomeIcon icon={faArrowsRotate} />}
                      onClick={loadData}
                      loading={loading}
                      size="large"
                      className="rounded-2xl font-black h-11 border-pink-200 text-pink-700 bg-pink-50 hover:bg-pink-100"
                    >
                      Refresh
                    </Button>
                  </div>
                </div>

                {/* Active Filter Chips */}
                {hasActiveFilters && (
                  <div className="mt-4 pt-3 border-t border-pink-200/60 dark:border-pink-900/40 flex flex-wrap items-center gap-2 text-xs">
                    <span className="font-black text-pink-600">Active Filters:</span>
                    {filterType !== 'all' && (
                      <Tag closable onClose={() => setFilterType('all')} color="magenta" className="font-black rounded-xl px-2.5 py-0.5">
                        Type: {filterType.toUpperCase()}
                      </Tag>
                    )}
                    {searchCategory.trim() !== '' && (
                      <Tag closable onClose={() => setSearchCategory('')} color="purple" className="font-black rounded-xl px-2.5 py-0.5">
                        Category: &quot;{searchCategory}&quot;
                      </Tag>
                    )}
                    {dateRange !== null && (
                      <Tag closable onClose={() => setDateRange(null)} color="gold" className="font-black rounded-xl px-2.5 py-0.5">
                        Range Filter
                      </Tag>
                    )}
                  </div>
                )}
              </div>

              {/* Transactions Table Container */}
              <div className={`rounded-3xl border overflow-hidden transition-all duration-300 backdrop-blur-md shadow-xl ${
                isDarkMode ? 'bg-[#240c1e]/90 border-pink-900/40 shadow-pink-950/20' : 'bg-white/95 border-pink-200/80 shadow-pink-100/70'
              }`}>
                <div className="p-5 border-b border-pink-200/60 dark:border-pink-900/40 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-pink-500 to-rose-500 text-white flex items-center justify-center text-base shadow-sm">
                      <FontAwesomeIcon icon={faTableList} />
                    </div>
                    <div>
                      <h2 className={`text-lg font-black m-0 ${isDarkMode ? 'text-pink-100' : 'text-slate-900'}`}>Full Transaction Audit Ledger 📋</h2>
                      <span className={`text-xs font-semibold ${isDarkMode ? 'text-pink-300/70' : 'text-pink-700/80'}`}>Complete ledger of logged income & expense records ({currencyKey})</span>
                    </div>
                  </div>
                  <Tag color="magenta" className="font-black px-3 py-1 rounded-xl text-xs shadow-2xs">
                    {transactions.length} Records
                  </Tag>
                </div>

                <Table
                  columns={columns}
                  dataSource={transactions}
                  rowKey="id"
                  loading={loading}
                  pagination={{
                    pageSize: 10,
                    showSizeChanger: true,
                    showTotal: renderPaginationTotal
                  }}
                  locale={{
                    emptyText: (
                      <div className="py-16 text-center space-y-3">
                        <span className="block font-black text-pink-300/70 text-lg">No transactions recorded yet! ✨</span>
                        <span className="block text-pink-300/50 text-xs font-semibold">Use 1-Click Quick Add preset buttons above or tap Demo Data to test out.</span>
                        <Button type="primary" onClick={handleLoadSampleData} icon={<FontAwesomeIcon icon={faWandMagicSparkles} />} className="bg-pink-600 font-extrabold rounded-2xl mt-2 border-0">
                          Load Demo Data
                        </Button>
                      </div>
                    )
                  }}
                />
              </div>
            </div>
          )}

          {/* SECTION 8: SAVINGS GOALS VAULT */}
          {activeWorkspaceKey === 'goals' && (
            <SavingsGoals onSuccess={loadData} isDarkMode={isDarkMode} />
          )}

          {/* SECTION 9: RECURRING SUBSCRIPTIONS */}
          {activeWorkspaceKey === 'subscriptions' && (
            <RecurringSubscriptions onSuccess={loadData} isDarkMode={isDarkMode} />
          )}

          {/* Add / Edit Transaction Modal */}
          <TransactionModal
            open={isModalOpen}
            onCancel={() => {
              setIsModalOpen(false);
              setEditingTransaction(null);
            }}
            onSubmit={handleModalSubmit}
            initialValues={editingTransaction}
            loading={modalLoading}
          />

          {/* Bank Statement CSV Import Modal */}
          <CSVImportModal
            open={isImportOpen}
            onClose={() => setIsImportOpen(false)}
            onSuccess={loadData}
          />

          {/* User Guide Modal */}
          <Modal
            title={<span className="font-black text-lg text-slate-900">💡 Quick User Guide</span>}
            open={isHelpOpen}
            onCancel={() => setIsHelpOpen(false)}
            footer={[
              <Button key="ok" type="primary" onClick={() => setIsHelpOpen(false)} className="bg-pink-600 font-bold rounded-xl border-0">
                Got it! ✨
              </Button>
            ]}
          >
            <div className="space-y-4 text-sm py-2 font-medium text-slate-700">
              <div className="p-4 bg-pink-50 rounded-2xl text-pink-900 border border-pink-200">
                Welcome to <strong>Finora Pro</strong> — your intelligent financial operating system and wealth platform.
              </div>

              <ol className="list-decimal list-inside space-y-2.5">
                <li><strong>AI Financial Copilot</strong>: Ask natural-language questions and inspect deterministic math steps.</li>
                <li><strong>30-Day Cash Flow Forecast</strong>: View your projected balance waterfall.</li>
                <li><strong>Net Worth Engine</strong>: Manage Assets vs Liabilities and view 5-month growth history.</li>
                <li><strong>Debt Payoff Planner</strong>: Test extra payment sliders and calculate interest saved.</li>
                <li><strong>Bank CSV Import</strong>: Upload bank CSV statements with column mapping.</li>
              </ol>
            </div>
          </Modal>

          {/* Technical Showcase Modal */}
          <RecruiterSpotlightModal open={isSpotlightOpen} onClose={() => setIsSpotlightOpen(false)} />

        </main>
        </div>

        {/* Professional Footer with Engineering Link */}
        <footer className="mt-12 pt-6 border-t border-pink-200/60 dark:border-pink-900/40 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-bold text-pink-600/80 mb-16 md:mb-0">
          <span>© 2026 Finora Pro Financial Operating System • All Rights Reserved</span>
          <button
            onClick={() => setIsSpotlightOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-pink-100 dark:bg-pink-950/40 border border-pink-300/60 hover:bg-pink-200 text-pink-700 dark:text-pink-300 font-black transition-all"
          >
            <FontAwesomeIcon icon={faGear} />
            <span>⚙️ Engineering & Architecture</span>
          </button>
        </footer>

        {/* Refined Mobile Navigation Bar (5 Core Destinations for One-Thumb Ergonomics) */}
        <nav aria-label="Mobile Navigation" className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 dark:bg-[#1f0918]/95 backdrop-blur-lg border-t border-pink-200/80 dark:border-pink-900/40 px-2 py-1.5 md:hidden flex justify-around items-center shadow-2xl">
          {[
            { key: 'overview', label: 'Overview', icon: faGaugeHigh },
            { key: 'ledger', label: 'Transactions', icon: faTableList },
            { key: 'ai', label: 'Copilot', icon: faBrain },
            { key: 'goals', label: 'Wishlists', icon: faPiggyBank }
          ].map(mItem => (
            <button
              key={mItem.key}
              onClick={() => {
                setActiveWorkspaceKey(mItem.key);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all ${
                activeWorkspaceKey === mItem.key
                  ? 'text-pink-600 dark:text-pink-400 font-black bg-pink-100/70 dark:bg-pink-950/60 scale-105'
                  : 'text-slate-500 dark:text-pink-300/60 font-semibold hover:text-pink-500'
              }`}
            >
              <FontAwesomeIcon icon={mItem.icon} className="text-base mb-0.5" />
              <span className="text-[10px] tracking-tight">{mItem.label}</span>
            </button>
          ))}

          {/* 5th Destination: More Menu */}
          <button
            onClick={() => setIsMoreMobileOpen(true)}
            className="flex flex-col items-center justify-center py-1 px-2.5 rounded-xl text-slate-500 dark:text-pink-300/60 font-semibold hover:text-pink-500 transition-all"
          >
            <FontAwesomeIcon icon={faGear} className="text-base mb-0.5 text-pink-500" />
            <span className="text-[10px] tracking-tight font-black text-pink-600">More ≡</span>
          </button>
        </nav>

        {/* Mobile "More" Drawer for Extended Tools */}
        <Drawer
          title={<span className="font-black text-lg text-slate-900">🌸 Finora Navigation & Tools</span>}
          placement="bottom"
          height="auto"
          onClose={() => setIsMoreMobileOpen(false)}
          open={isMoreMobileOpen}
        >
          <div className="grid grid-cols-2 gap-3 py-2 text-xs font-black">
            {[
              { key: 'forecast', label: '🔮 Cash-Flow Forecast', icon: faWandMagicSparkles },
              { key: 'networth', label: '💰 Net Worth Vault', icon: faVault },
              { key: 'debt', label: '💳 Debt Acceleration', icon: faCreditCard },
              { key: 'calendar', label: '📅 Money Calendar', icon: faCalendarDays },
              { key: 'subscriptions', label: '🔄 Subscriptions', icon: faRepeat }
            ].map(drawerItem => (
              <button
                key={drawerItem.key}
                onClick={() => {
                  setActiveWorkspaceKey(drawerItem.key);
                  setIsMoreMobileOpen(false);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="flex items-center gap-2 p-3.5 rounded-2xl bg-pink-50 hover:bg-pink-100 border border-pink-200 text-pink-900 text-left transition-all"
              >
                <FontAwesomeIcon icon={drawerItem.icon} className="text-pink-500" />
                <span>{drawerItem.label}</span>
              </button>
            ))}
          </div>
        </Drawer>
      </div>
    </ConfigProvider>
  );
};

export default Home;
