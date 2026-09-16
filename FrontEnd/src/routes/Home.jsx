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
  faShieldHalved,
  faVault,
  faCircleQuestion,
  faWandMagicSparkles,
  faMoon,
  faSun,
  faCoins,
  faPiggyBank,
  faRepeat,
  faSeedling,
  faWallet
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
  <span className="font-extrabold text-slate-400 text-xs">Total {total} entries recorded</span>
);

const SAMPLE_ENTRIES = [
  { type: 'income', amount: 3500, category: 'Salary', description: 'Monthly Software Engineer Salary', date: dayjs().toISOString() },
  { type: 'expense', amount: 150, category: 'Groceries', description: 'Supermarket Groceries', date: dayjs().subtract(1, 'day').toISOString() },
  { type: 'expense', amount: 65, category: 'Transport', description: 'Fuel & Rides', date: dayjs().subtract(2, 'day').toISOString() },
  { type: 'expense', amount: 120, category: 'Utilities', description: 'Electricity & Internet', date: dayjs().subtract(3, 'day').toISOString() },
  { type: 'income', amount: 450, category: 'Freelance', description: 'UI Design Project', date: dayjs().subtract(4, 'day').toISOString() }
];

const Home = () => {
  const [loading, setLoading] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [summary, setSummary] = useState({ totalIncome: 0, totalExpenses: 0, balance: 0 });

  // Theme & Customization
  const [currencyKey, setCurrencyKey] = useState('USD');
  const [isDarkMode, setIsDarkMode] = useState(true);

  // Filters
  const [filterType, setFilterType] = useState('all');
  const [searchCategory, setSearchCategory] = useState('');
  const [dateRange, setDateRange] = useState(null);

  // Modals
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
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
        message.success('Transaction updated successfully!');
      } else {
        await createTransaction(formData);
        message.success('Transaction added successfully!');
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
      message.success('Sample demo data loaded successfully!');
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
    link.setAttribute('download', `ExpenseTracker_Pro_${currencyKey}_${dayjs().format('YYYYMMDD_HHmmss')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    message.success(`Ledger exported in ${currencyKey}!`);
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
            ▲ Income
          </span>
        ) : (
          <span className="px-3 py-1 text-xs font-black rounded-xl border border-rose-500/30 bg-rose-500/10 text-rose-400 uppercase tracking-wider inline-flex items-center gap-1">
            ▼ Expense
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
              className="w-10 h-10 rounded-2xl flex items-center justify-center text-sm shadow-inner border border-white/10"
              style={{ backgroundColor: meta.bg, color: meta.color }}
            >
              <FontAwesomeIcon icon={meta.icon} />
            </div>
            <span className={`font-black text-sm ${isDarkMode ? 'text-slate-100' : 'text-slate-900'}`}>{text}</span>
          </div>
        );
      }
    },
    {
      title: 'Description / Notes',
      dataIndex: 'description',
      key: 'description',
      render: text => <span className={`font-medium text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>{text || '-'}</span>
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      width: 140,
      sorter: (a, b) => new Date(a.date) - new Date(b.date),
      render: date => <span className={`font-extrabold text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>{dayjs(date).format('MMM DD, YYYY')}</span>
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
          <span className={`font-black text-base tracking-tight ${isIncome ? 'text-emerald-400' : 'text-rose-400'}`}>
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
            className="hover:bg-sky-500/20 rounded-xl text-sky-400 font-bold"
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
              className="hover:bg-rose-500/20 rounded-xl text-rose-400 font-bold"
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
          colorPrimary: '#0284c7',
          colorBgContainer: isDarkMode ? '#0b1329' : '#ffffff',
          borderRadius: 16,
          fontFamily: 'Plus Jakarta Sans, sans-serif'
        }
      }}
    >
      <div className={`min-h-screen ${isDarkMode ? 'bg-[#030712] text-slate-100' : 'bg-slate-50 text-slate-900'} p-4 md:p-8 font-sans antialiased transition-colors duration-300`}>
        <div className="max-w-7xl mx-auto space-y-6">

          {/* Navigation Header */}
          <div className={`rounded-3xl border transition-colors duration-300 p-6 ${
            isDarkMode ? 'bg-[#0b1329] border-slate-800 shadow-2xl shadow-sky-950/40' : 'bg-white border-slate-200/90 shadow-sm'
          }`}>
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              
              {/* Brand Logo & Descriptive Name */}
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-3xl bg-gradient-to-tr from-sky-600 via-blue-600 to-cyan-500 text-white flex items-center justify-center text-2xl font-black shadow-lg shadow-sky-600/30">
                  <FontAwesomeIcon icon={faWallet} />
                </div>
                <div>
                  <div className="flex items-center gap-3">
                    <h1 className="text-3xl md:text-4xl font-black tracking-tight bg-gradient-to-r from-sky-400 via-cyan-300 to-blue-400 bg-clip-text text-transparent m-0">
                      ExpenseTracker Pro
                    </h1>
                    <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                      <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
                      ACTIVE VAULT
                    </span>
                  </div>
                  <span className={`mt-1 flex items-center gap-2 text-xs font-bold ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                    <FontAwesomeIcon icon={faShieldHalved} className="text-sky-400" />
                    Executive Income & Expense Management • {dayjs().format('dddd, MMMM D, YYYY')}
                  </span>
                </div>
              </div>

              {/* Toolbar Controls */}
              <div className="flex flex-wrap items-center gap-3">
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

                {/* Dark / Light Toggle */}
                <Button
                  size="large"
                  onClick={() => setIsDarkMode(!isDarkMode)}
                  icon={<FontAwesomeIcon icon={isDarkMode ? faSun : faMoon} className={isDarkMode ? 'text-amber-400' : 'text-slate-600'} />}
                  className={`rounded-2xl font-extrabold border ${
                    isDarkMode ? 'bg-slate-900 border-slate-700 text-slate-200' : 'bg-slate-100 border-slate-200 text-slate-700'
                  }`}
                >
                  {isDarkMode ? 'Light' : 'Dark'}
                </Button>

                {/* Load Demo Data */}
                <Button
                  icon={<FontAwesomeIcon icon={faWandMagicSparkles} className="text-cyan-400" />}
                  size="large"
                  onClick={handleLoadSampleData}
                  loading={loading}
                  className={`font-extrabold rounded-2xl border ${
                    isDarkMode ? 'bg-cyan-950/40 border-cyan-800/50 text-cyan-300 hover:bg-cyan-900/60' : 'bg-blue-50 border-blue-200 text-blue-700'
                  }`}
                >
                  Demo Data
                </Button>

                {/* Export CSV */}
                <Button
                  icon={<FontAwesomeIcon icon={faFileCsv} className={isDarkMode ? 'text-slate-300' : 'text-slate-600'} />}
                  size="large"
                  onClick={exportToCSV}
                  className={`font-extrabold rounded-2xl border ${
                    isDarkMode ? 'bg-slate-900 border-slate-700 text-slate-200 hover:bg-slate-800' : 'bg-slate-100 border-slate-200 text-slate-700'
                  }`}
                >
                  Export CSV
                </Button>

                {/* Primary Add Transaction */}
                <Button
                  type="primary"
                  size="large"
                  icon={<FontAwesomeIcon icon={faPlus} />}
                  onClick={handleOpenAddModal}
                  className="bg-gradient-to-r from-sky-600 via-blue-600 to-cyan-600 hover:from-sky-500 hover:to-blue-500 text-white font-black rounded-2xl shadow-lg shadow-sky-600/30 border-0 px-6"
                >
                  + Add Entry
                </Button>

                {/* Guide Button */}
                <Button
                  type="text"
                  size="large"
                  icon={<FontAwesomeIcon icon={faCircleQuestion} className="text-slate-400 text-xl" />}
                  onClick={() => setIsHelpOpen(true)}
                  title="User Guide"
                />
              </div>

            </div>
          </div>

          {/* Gamified Milestones & Badges */}
          <AchievementBadges summary={convertedSummary} transactionCount={transactions.length} isDarkMode={isDarkMode} />

          {/* Hero Financial Summary Stat Grid */}
          <SummaryCards
            summary={convertedSummary}
            activeFilter={filterType}
            onSelectFilter={type => setFilterType(type)}
            currencySymbol={currency.symbol}
            isDarkMode={isDarkMode}
          />

          {/* Algorithmic Financial Health Rating & Predictions */}
          <FinancialHealthScore summary={convertedSummary} transactions={transactions} isDarkMode={isDarkMode} />

          {/* Cash Flow Analytics Chart */}
          <FinancialAnalyticsChart summary={convertedSummary} currencySymbol={currency.symbol} isDarkMode={isDarkMode} />

          {/* Interactive Tools (Presets, Budget & Emergency Runway) */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <QuickAddPresets onSuccess={loadData} isDarkMode={isDarkMode} />
            <BudgetMeter totalExpenses={convertedSummary.totalExpenses} isDarkMode={isDarkMode} />
            <EmergencyRunway summary={convertedSummary} isDarkMode={isDarkMode} />
          </div>

          {/* Main Content Tabs (Ledger, Category Breakdown, Savings Goals, Subscriptions, Wealth Growth) */}
          <Tabs
            defaultActiveKey="overview"
            size="large"
            items={[
              {
                key: 'overview',
                label: (
                  <span className={`font-black px-3 py-1 flex items-center gap-2 text-base ${isDarkMode ? 'text-slate-200' : 'text-slate-900'}`}>
                    <FontAwesomeIcon icon={faListCheck} className="text-sky-400" />
                    Transactions Ledger ({currencyKey})
                  </span>
                ),
                children: (
                  <div className="space-y-4">
                    {/* Search, Date & Type Filter Toolbar */}
                    <div className={`p-5 rounded-3xl border transition-colors duration-300 ${
                      isDarkMode ? 'bg-[#0b1329] border-slate-800' : 'bg-white border-slate-200/90 shadow-sm'
                    }`}>
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                        <div className="flex flex-wrap items-center gap-3">
                          <Segmented
                            size="large"
                            value={filterType}
                            onChange={value => setFilterType(value)}
                            options={[
                              { label: <span className="font-extrabold px-3">ALL ENTRIES</span>, value: 'all' },
                              { label: <span className="font-extrabold text-emerald-400 px-3">💰 INCOME</span>, value: 'income' },
                              { label: <span className="font-extrabold text-rose-400 px-3">💸 EXPENSES</span>, value: 'expense' }
                            ]}
                            className={isDarkMode ? 'bg-slate-900 text-slate-200 font-extrabold p-1 rounded-2xl' : 'bg-slate-100 text-slate-700 font-extrabold p-1 rounded-2xl'}
                          />

                          <Input
                            placeholder="Search category..."
                            prefix={<FontAwesomeIcon icon={faMagnifyingGlass} className="text-slate-400" />}
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
                    </div>

                    <div className={`rounded-3xl border overflow-hidden transition-colors duration-300 ${
                      isDarkMode ? 'bg-[#0b1329] border-slate-800' : 'bg-white border-slate-200/90 shadow-sm'
                    }`}>
                      <Table
                        columns={columns}
                        dataSource={transactions}
                        rowKey="id"
                        loading={loading}
                        pagination={{
                          pageSize: 8,
                          showSizeChanger: true,
                          showTotal: renderPaginationTotal
                        }}
                        locale={{
                          emptyText: (
                            <div className="py-16 text-center space-y-3">
                              <span className="block font-black text-slate-400 text-lg">No transactions recorded yet!</span>
                              <span className="block text-slate-500 text-xs font-semibold">Use 1-Click Quick Add preset buttons above or tap Demo Data to test out.</span>
                              <Button type="primary" onClick={handleLoadSampleData} icon={<FontAwesomeIcon icon={faWandMagicSparkles} />} className="bg-sky-600 font-extrabold rounded-2xl mt-2">
                                Load Demo Data
                              </Button>
                            </div>
                          )
                        }}
                      />
                    </div>
                  </div>
                )
              },
              {
                key: 'analytics',
                label: (
                  <span className={`font-black px-3 py-1 flex items-center gap-2 text-base ${isDarkMode ? 'text-slate-200' : 'text-slate-900'}`}>
                    <FontAwesomeIcon icon={faChartPie} className="text-emerald-400" />
                    Category Breakdown Insights
                  </span>
                ),
                children: <CategoryAnalytics transactions={transactions} isDarkMode={isDarkMode} />
              },
              {
                key: 'goals',
                label: (
                  <span className={`font-black px-3 py-1 flex items-center gap-2 text-base ${isDarkMode ? 'text-slate-200' : 'text-slate-900'}`}>
                    <FontAwesomeIcon icon={faPiggyBank} className="text-cyan-400" />
                    Savings Goals Vault
                  </span>
                ),
                children: <SavingsGoals onSuccess={loadData} isDarkMode={isDarkMode} />
              },
              {
                key: 'subscriptions',
                label: (
                  <span className={`font-black px-3 py-1 flex items-center gap-2 text-base ${isDarkMode ? 'text-slate-200' : 'text-slate-900'}`}>
                    <FontAwesomeIcon icon={faRepeat} className="text-rose-400" />
                    Recurring Bills & Subscriptions
                  </span>
                ),
                children: <RecurringSubscriptions onSuccess={loadData} isDarkMode={isDarkMode} />
              },
              {
                key: 'growth',
                label: (
                  <span className={`font-black px-3 py-1 flex items-center gap-2 text-base ${isDarkMode ? 'text-slate-200' : 'text-slate-900'}`}>
                    <FontAwesomeIcon icon={faSeedling} className="text-teal-400" />
                    Wealth Growth Simulator
                  </span>
                ),
                children: <WealthGrowthCalculator isDarkMode={isDarkMode} />
              }
            ]}
          />

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
            title={<span className="font-black text-lg">💡 Quick User Guide</span>}
            open={isHelpOpen}
            onCancel={() => setIsHelpOpen(false)}
            footer={[
              <Button key="ok" type="primary" onClick={() => setIsHelpOpen(false)} className="bg-sky-600 font-bold rounded-xl">
                Got it!
              </Button>
            ]}
          >
            <div className="space-y-4 text-sm py-2 font-medium">
              <div className="p-4 bg-sky-500/20 rounded-2xl text-sky-200 border border-sky-500/30">
                Welcome to <strong>ExpenseTracker Pro</strong>! Executive income & expense management.
              </div>

              <ol className="list-decimal list-inside space-y-2.5">
                <li><strong>Multi-Currency</strong>: Switch between USD $, EUR €, GBP £, and PKR Rs instantly!</li>
                <li><strong>Wealth Growth Simulator</strong>: Project long-term compound net worth over 1 to 30 years.</li>
                <li><strong>Emergency Safety Runway</strong>: View months of zero-income survival buffer.</li>
                <li><strong>Savings Goals Vault</strong>: Track target goals and deposit funds directly with 1 click.</li>
                <li><strong>Recurring Subscriptions</strong>: Track monthly commitment burdens and log bill payments.</li>
                <li><strong>Export CSV</strong>: Download your transaction ledger to CSV anytime.</li>
              </ol>
            </div>
          </Modal>

        </div>
      </div>
    </ConfigProvider>
  );
};

export default Home;
