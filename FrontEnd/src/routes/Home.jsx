import { useState, useEffect, useCallback } from 'react';
import { ConfigProvider, Table, Button, Tag, Space, Input, Popconfirm, message, DatePicker, Segmented, Tabs, Modal, Select, theme as antTheme } from 'antd';
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
  faCrown
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
  <span className="font-extrabold text-pink-300/70 text-xs">Total {total} cute entries logged ✨</span>
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

  // Connected Navigation Workspace Key
  const [activeWorkspaceKey, setActiveWorkspaceKey] = useState('overview');

  // Theme & Customization
  const [currencyKey, setCurrencyKey] = useState('USD');
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Filters
  const [filterType, setFilterType] = useState('all');
  const [searchCategory, setSearchCategory] = useState('');
  const [dateRange, setDateRange] = useState(null);

  // Modals
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isSpotlightOpen, setIsSpotlightOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);

  const currency = CURRENCIES[currencyKey] || CURRENCIES.USD;

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
      message.success('Sample cute demo data loaded! ✨');
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
    link.setAttribute('download', `BloomVault_${currencyKey}_${dayjs().format('YYYYMMDD_HHmmss')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    message.success(`Ledger exported in ${currencyKey}! ✨`);
  };

  const convertedSummary = {
    totalIncome: summary.totalIncome * currency.rate,
    totalExpenses: summary.totalExpenses * currency.rate,
    balance: summary.balance * currency.rate
  };

  const columns = [
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      width: 130,
      render: type =>
        type === 'income' ? (
          <span className="px-3 py-1 text-xs font-black rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 uppercase tracking-wider inline-flex items-center gap-1">
            ▲ Inflow
          </span>
        ) : (
          <span className="px-3 py-1 text-xs font-black rounded-xl border border-pink-500/30 bg-pink-500/10 text-pink-400 uppercase tracking-wider inline-flex items-center gap-1">
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
      render: text => <span className={`font-medium text-sm ${isDarkMode ? 'text-pink-300/70' : 'text-slate-600'}`}>{text || '-'}</span>
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
          <span className={`font-black text-base tracking-tight ${isIncome ? 'text-emerald-400' : 'text-pink-400'}`}>
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
            className="hover:bg-pink-500/20 rounded-xl text-pink-300 font-bold"
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
              className="hover:bg-rose-500/20 rounded-xl text-pink-400 font-bold"
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
      <div className={`min-h-screen ${isDarkMode ? 'bg-[#180715] text-pink-100' : 'bg-gradient-to-br from-pink-50 via-purple-50/50 to-rose-50 text-slate-900'} p-4 md:p-8 font-sans antialiased transition-colors duration-300`}>
        <div className="max-w-7xl mx-auto space-y-6">

          {/* Cute Pinterest Aesthetic Top Navigation Header */}
          <div className={`rounded-3xl border transition-all duration-300 overflow-hidden ${
            isDarkMode
              ? 'bg-[#240c1e] border-pink-900/40 shadow-2xl shadow-pink-950/50'
              : 'bg-white/95 backdrop-blur-md border-pink-200/80 shadow-xl shadow-pink-100/70'
          }`}>
            <div className="p-6 space-y-5">
              
              {/* Layer 1: Brand & Right Action Controls Toolbar */}
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
                        BloomVault 🌸
                      </h1>
                      <span className={`flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-black border ${
                        isDarkMode ? 'bg-pink-500/20 text-pink-300 border-pink-500/30' : 'bg-pink-100 text-pink-700 border-pink-300/80'
                      }`}>
                        <span className="w-2.5 h-2.5 rounded-full bg-pink-500 animate-pulse"></span>
                        GIRLS' DIARY
                      </span>
                    </div>
                    <span className={`mt-1 flex items-center gap-2 text-xs font-extrabold ${isDarkMode ? 'text-pink-300/70' : 'text-pink-700/80'}`}>
                      <FontAwesomeIcon icon={faCrown} className="text-pink-500" />
                      Cute Aesthetic Finance & Habit Vault • {dayjs().format('dddd, MMMM D, YYYY')}
                    </span>
                  </div>
                </div>

                {/* Right Sequenced Action Toolbar */}
                <div className="flex flex-wrap items-center gap-2.5">
                  {/* Currency Switcher */}
                  <Select
                    value={currencyKey}
                    onChange={val => setCurrencyKey(val)}
                    size="large"
                    className="w-32 font-black rounded-2xl"
                    suffixIcon={<FontAwesomeIcon icon={faCoins} className="text-amber-400" />}
                  >
                    <Option value="USD">USD ($)</Option>
                    <Option value="EUR">EUR (€)</Option>
                    <Option value="GBP">GBP (£)</Option>
                    <Option value="PKR">PKR (Rs)</Option>
                  </Select>

                  {/* Mode Toggle */}
                  <Button
                    size="large"
                    onClick={() => setIsDarkMode(!isDarkMode)}
                    icon={<FontAwesomeIcon icon={isDarkMode ? faSun : faMoon} className={isDarkMode ? 'text-amber-400' : 'text-pink-600'} />}
                    className={`rounded-2xl font-black border transition-all ${
                      isDarkMode
                        ? 'bg-[#180814] border-pink-900/40 text-pink-200 hover:border-pink-500'
                        : 'bg-pink-50 border-pink-200 text-pink-900 hover:bg-pink-100 shadow-xs'
                    }`}
                  >
                    {isDarkMode ? 'Soft Mode 🌸' : 'Cozy Dark 🌙'}
                  </Button>

                  {/* Demo Data Button */}
                  <Button
                    icon={<FontAwesomeIcon icon={faWandMagicSparkles} className="text-pink-500" />}
                    size="large"
                    onClick={handleLoadSampleData}
                    loading={loading}
                    className={`font-black rounded-2xl border transition-all ${
                      isDarkMode
                        ? 'bg-pink-950/40 border-pink-800/50 text-pink-300 hover:bg-pink-900/60'
                        : 'bg-pink-50 border-pink-200 text-pink-800 hover:bg-pink-100 shadow-xs'
                    }`}
                  >
                    Demo Data ✨
                  </Button>

                  {/* Export CSV Button */}
                  <Button
                    icon={<FontAwesomeIcon icon={faFileCsv} className={isDarkMode ? 'text-pink-300' : 'text-slate-700'} />}
                    size="large"
                    onClick={exportToCSV}
                    className={`font-black rounded-2xl border transition-all ${
                      isDarkMode
                        ? 'bg-[#180814] border-pink-900/40 text-pink-200 hover:bg-pink-950/60'
                        : 'bg-slate-100/90 border-slate-200 text-slate-800 hover:bg-slate-200 shadow-xs'
                    }`}
                  >
                    Export CSV
                  </Button>

                  {/* Primary CTA: Log Entry */}
                  <Button
                    type="primary"
                    size="large"
                    icon={<FontAwesomeIcon icon={faPlus} />}
                    onClick={handleOpenAddModal}
                    className="bg-gradient-to-r from-pink-500 via-rose-500 to-purple-500 hover:from-pink-600 hover:to-rose-600 text-white font-black rounded-2xl shadow-lg shadow-pink-500/30 border-0 px-6 transition-all hover:scale-105"
                  >
                    + Log Entry 💖
                  </Button>
                </div>
              </div>

              {/* Layer 2: Live Status & Recruiter Ticker Ribbon */}
              <div className={`p-3.5 rounded-2xl border flex flex-wrap items-center justify-between gap-3 text-xs ${
                isDarkMode ? 'bg-[#180814]/80 border-pink-900/30' : 'bg-pink-50/80 border-pink-200/60'
              }`}>
                <div className="flex flex-wrap items-center gap-4">
                  <span className="flex items-center gap-1.5 font-black text-pink-600">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                    API Connected (Port 4000)
                  </span>
                  <span className="text-pink-400">|</span>
                  <span className={`font-bold ${isDarkMode ? 'text-pink-200' : 'text-slate-700'}`}>
                    📊 Total Logged: <strong className="text-pink-500">{transactions.length} Entries</strong>
                  </span>
                  <span className="text-pink-400">|</span>
                  <span className={`font-bold ${isDarkMode ? 'text-pink-200' : 'text-slate-700'}`}>
                    💖 Vault Balance: <strong className="text-emerald-500">{currency.symbol}{(summary.balance * currency.rate).toFixed(2)}</strong>
                  </span>
                </div>

                <Button
                  size="small"
                  onClick={() => setIsSpotlightOpen(true)}
                  icon={<FontAwesomeIcon icon={faStar} className="text-amber-400" />}
                  className="bg-gradient-to-r from-amber-500/20 to-purple-500/20 text-purple-700 dark:text-purple-300 border border-amber-400/40 font-black rounded-xl text-xs px-3 py-1 hover:scale-105 transition-all"
                >
                  ⭐ Recruiter Architecture Spotlight
                </Button>
              </div>

              {/* Layer 3: Sequenced Navigation Navbar Tabs */}
              <div className="pt-2 flex flex-wrap items-center gap-2">
                {[
                  { key: 'overview', label: '🌸 Aesthetic Dashboard', icon: faGaugeHigh },
                  { key: 'ledger', label: '📋 Transactions Ledger', icon: faTableList, count: transactions.length },
                  { key: 'vibe', label: '✨ Daily Mood Vibe', icon: faSmileBeam },
                  { key: 'analytics', label: '💅 Category Insights', icon: faChartPie },
                  { key: 'goals', label: '💖 Dream Wishlists', icon: faPiggyBank },
                  { key: 'subscriptions', label: '🔄 Recurring Bills', icon: faRepeat },
                  { key: 'growth', label: '🌱 Wealth Simulator', icon: faSeedling },
                  { key: 'architecture', label: '⭐ Recruiter Showcase', icon: faStar }
                ].map(nav => (
                  <button
                    key={nav.key}
                    onClick={() => {
                      if (nav.key === 'architecture') {
                        setIsSpotlightOpen(true);
                      } else {
                        setActiveWorkspaceKey(nav.key);
                      }
                    }}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl font-black text-xs transition-all ${
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
              </div>

            </div>
          </div>

          {/* Gamified Milestones & Badges Header Ribbon */}
          <AchievementBadges summary={convertedSummary} transactionCount={transactions.length} isDarkMode={isDarkMode} />

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

          {/* SECTION 1: AESTHETIC DASHBOARD OVERVIEW */}
          {activeWorkspaceKey === 'overview' && (
            <div className="space-y-6">
              <SpendingMoodTracker isDarkMode={isDarkMode} />
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

          {/* SECTION 2: TRANSACTIONS LEDGER & AUDIT TABLE */}
          {activeWorkspaceKey === 'ledger' && (
            <div className="space-y-4">
              {/* Search, Date & Type Filter Toolbar */}
              <div className={`p-5 rounded-3xl border transition-colors duration-300 ${
                isDarkMode ? 'bg-[#240c1e] border-pink-900/40 shadow-xl' : 'bg-white border-pink-100 shadow-sm'
              }`}>
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="flex flex-wrap items-center gap-3">
                    <Segmented
                      size="large"
                      value={filterType}
                      onChange={value => setFilterType(value)}
                      options={[
                        { label: <span className="font-extrabold px-3">ALL ENTRIES</span>, value: 'all' },
                        { label: <span className="font-extrabold text-emerald-400 px-3">💰 INFLOW</span>, value: 'income' },
                        { label: <span className="font-extrabold text-pink-400 px-3">💸 OUTFLOW</span>, value: 'expense' }
                      ]}
                      className={isDarkMode ? 'bg-[#180814] text-pink-200 font-extrabold p-1 rounded-2xl' : 'bg-pink-50 text-pink-800 font-extrabold p-1 rounded-2xl'}
                    />

                    <Input
                      placeholder="Search category..."
                      prefix={<FontAwesomeIcon icon={faMagnifyingGlass} className="text-pink-400/60" />}
                      value={searchCategory}
                      onChange={e => setSearchCategory(e.target.value)}
                      style={{ width: 190 }}
                      size="large"
                      className="rounded-2xl"
                      allowClear
                    />

                    <RangePicker
                      value={dateRange}
                      onChange={dates => setDateRange(dates)}
                      size="large"
                      className="rounded-2xl"
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
                        className="rounded-2xl font-extrabold"
                      >
                        Clear Filters
                      </Button>
                    )}
                    <Button
                      icon={<FontAwesomeIcon icon={faArrowsRotate} />}
                      onClick={loadData}
                      loading={loading}
                      size="large"
                      className="rounded-2xl font-extrabold"
                    >
                      Refresh
                    </Button>
                  </div>
                </div>

                {/* Active Filter Chips */}
                {hasActiveFilters && (
                  <div className="mt-4 pt-3 border-t border-pink-900/40 flex flex-wrap items-center gap-2 text-xs">
                    <span className="font-bold text-pink-300/70">Active Filters:</span>
                    {filterType !== 'all' && (
                      <Tag closable onClose={() => setFilterType('all')} color="magenta" className="font-bold rounded-xl px-2.5 py-0.5">
                        Type: {filterType.toUpperCase()}
                      </Tag>
                    )}
                    {searchCategory.trim() !== '' && (
                      <Tag closable onClose={() => setSearchCategory('')} color="purple" className="font-bold rounded-xl px-2.5 py-0.5">
                        Category: &quot;{searchCategory}&quot;
                      </Tag>
                    )}
                    {dateRange !== null && (
                      <Tag closable onClose={() => setDateRange(null)} color="gold" className="font-bold rounded-xl px-2.5 py-0.5">
                        Range Filter
                      </Tag>
                    )}
                  </div>
                )}
              </div>

              {/* Transactions Table Container */}
              <div className={`rounded-3xl border overflow-hidden transition-colors duration-300 ${
                isDarkMode ? 'bg-[#240c1e] border-pink-900/40 shadow-xl' : 'bg-white border-pink-100 shadow-sm'
              }`}>
                <div className="p-5 border-b border-pink-900/40 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-2xl bg-pink-500/20 text-pink-300 flex items-center justify-center text-base border border-pink-500/30">
                      <FontAwesomeIcon icon={faTableList} />
                    </div>
                    <div>
                      <h2 className="text-lg font-black m-0 text-white">Full Transaction Audit Ledger 📋</h2>
                      <span className="text-xs text-pink-300/70 font-semibold">Complete ledger of logged income & expense records ({currencyKey})</span>
                    </div>
                  </div>
                  <Tag color="magenta" className="font-black px-3 py-1 rounded-xl text-xs">
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

          {/* SECTION 3: DAILY SPENDING MOOD TRACKER */}
          {activeWorkspaceKey === 'vibe' && (
            <SpendingMoodTracker isDarkMode={isDarkMode} />
          )}

          {/* SECTION 4: CATEGORY ANALYTICS */}
          {activeWorkspaceKey === 'analytics' && (
            <CategoryAnalytics transactions={transactions} isDarkMode={isDarkMode} />
          )}

          {/* SECTION 5: SAVINGS GOALS VAULT */}
          {activeWorkspaceKey === 'goals' && (
            <SavingsGoals onSuccess={loadData} isDarkMode={isDarkMode} />
          )}

          {/* SECTION 6: RECURRING SUBSCRIPTIONS */}
          {activeWorkspaceKey === 'subscriptions' && (
            <RecurringSubscriptions onSuccess={loadData} isDarkMode={isDarkMode} />
          )}

          {/* SECTION 7: WEALTH GROWTH SIMULATOR */}
          {activeWorkspaceKey === 'growth' && (
            <WealthGrowthCalculator isDarkMode={isDarkMode} />
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

          {/* User Guide Modal */}
          <Modal
            title={<span className="font-black text-lg text-white">💡 Quick User Guide</span>}
            open={isHelpOpen}
            onCancel={() => setIsHelpOpen(false)}
            footer={[
              <Button key="ok" type="primary" onClick={() => setIsHelpOpen(false)} className="bg-pink-600 font-bold rounded-xl border-0">
                Got it! ✨
              </Button>
            ]}
          >
            <div className="space-y-4 text-sm py-2 font-medium text-pink-100">
              <div className="p-4 bg-pink-500/20 rounded-2xl text-pink-200 border border-pink-500/30">
                Welcome to <strong>BloomVault</strong>! Cute Pinterest aesthetic financial & habit diary 🌸.
              </div>

              <ol className="list-decimal list-inside space-y-2.5">
                <li><strong>Girls' Daily Mood Vibe</strong>: Log today's spending feeling (🌸 Mindful, 🛍️ Shopping Therapy, ☕ Cozy Cafe).</li>
                <li><strong>Navbar Workspaces</strong>: Switch between Ledger, Category Share, Wishlists & Wealth Simulator.</li>
                <li><strong>Multi-Currency</strong>: Switch between USD $, EUR €, GBP £, and PKR Rs.</li>
                <li><strong>Dream Wishlists</strong>: Track target goals and deposit funds directly with 1 click.</li>
                <li><strong>Export CSV</strong>: Download your cute transaction ledger anytime.</li>
              </ol>
            </div>
          </Modal>

          {/* Technical Showcase Modal */}
          <RecruiterSpotlightModal open={isSpotlightOpen} onClose={() => setIsSpotlightOpen(false)} />

        </div>
      </div>
    </ConfigProvider>
  );
};

export default Home;
