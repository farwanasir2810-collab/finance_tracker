import { useState, useEffect, useCallback } from 'react';
import { ConfigProvider, Table, Button, Tag, Space, Input, Popconfirm, Card, message, DatePicker, Segmented, Tabs, Modal, Select, theme as antTheme } from 'antd';
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
  faWallet,
  faUserCheck,
  faCalendarDays,
  faFilterCircleXmark,
  faCircleQuestion,
  faWandMagicSparkles,
  faMoon,
  faSun,
  faCoins
} from '@fortawesome/free-solid-svg-icons';
import dayjs from 'dayjs';

import SummaryCards from '../components/transactions/SummaryCards';
import CategoryAnalytics, { getCategoryMeta } from '../components/transactions/CategoryAnalytics';
import TransactionModal from '../components/transactions/TransactionModal';
import QuickAddPresets from '../components/transactions/QuickAddPresets';
import BudgetMeter from '../components/transactions/BudgetMeter';
import AchievementBadges from '../components/transactions/AchievementBadges';
import FinancialAnalyticsChart from '../components/transactions/FinancialAnalyticsChart';
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
  <span className="font-bold text-slate-500 text-xs">Total {total} entries recorded</span>
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

  // Customization & Controls
  const [currencyKey, setCurrencyKey] = useState('USD');
  const [isDarkMode, setIsDarkMode] = useState(false);

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
    link.setAttribute('download', `financial_report_${currencyKey}_${dayjs().format('YYYYMMDD_HHmmss')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    message.success(`Transactions exported in ${currencyKey}!`);
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
      width: 120,
      render: type =>
        type === 'income' ? (
          <Tag color="emerald" className="px-3 py-1 text-xs font-extrabold rounded-full uppercase tracking-wider border border-emerald-200 bg-emerald-50 text-emerald-700">
            ▲ Income
          </Tag>
        ) : (
          <Tag color="rose" className="px-3 py-1 text-xs font-extrabold rounded-full uppercase tracking-wider border border-rose-200 bg-rose-50 text-rose-700">
            ▼ Expense
          </Tag>
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
              className="w-9 h-9 rounded-xl flex items-center justify-center text-sm shadow-xs border border-slate-200/60"
              style={{ backgroundColor: meta.bg, color: meta.color }}
            >
              <FontAwesomeIcon icon={meta.icon} />
            </div>
            <span className="font-extrabold text-slate-900 text-sm">{text}</span>
          </div>
        );
      }
    },
    {
      title: 'Description / Notes',
      dataIndex: 'description',
      key: 'description',
      render: text => <span className="text-slate-600 font-medium text-sm">{text || '-'}</span>
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      width: 140,
      sorter: (a, b) => new Date(a.date) - new Date(b.date),
      render: date => <span className="text-slate-600 font-semibold text-xs">{dayjs(date).format('MMM DD, YYYY')}</span>
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      align: 'right',
      width: 160,
      sorter: (a, b) => a.amount - b.amount,
      render: (amount, record) => {
        const isIncome = record.type === 'income';
        const converted = Number(amount) * currency.rate;
        return (
          <span className={`font-black text-lg ${isIncome ? 'text-emerald-700' : 'text-rose-700'}`}>
            {isIncome ? '+' : '-'}{currency.symbol}{converted.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
        );
      }
    },
    {
      title: 'Actions',
      key: 'actions',
      align: 'center',
      width: 120,
      render: (_, record) => (
        <Space size="small">
          <Button
            type="text"
            className="hover:bg-slate-100 rounded-lg text-blue-600 font-bold"
            icon={<FontAwesomeIcon icon={faPenToSquare} />}
            onClick={() => handleOpenEditModal(record)}
            title="Edit"
          />
          <Popconfirm
            title="Delete record?"
            description="Are you sure you want to remove this entry?"
            onConfirm={() => handleDelete(record.id)}
            okText="Yes, Delete"
            cancelText="Cancel"
            okButtonProps={{ danger: true }}
          >
            <Button
              type="text"
              danger
              className="hover:bg-rose-50 rounded-lg text-rose-600 font-bold"
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
          colorPrimary: '#2563eb',
          borderRadius: 12,
          fontFamily: 'Plus Jakarta Sans, sans-serif'
        }
      }}
    >
      <div className={`min-h-screen ${isDarkMode ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'} p-4 md:p-8 font-sans antialiased transition-colors duration-300`}>
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Next-Gen Executive Header Banner */}
          <div className={`rounded-2xl border ${isDarkMode ? 'border-slate-800 bg-slate-900' : 'border-slate-200/90 bg-white'} p-6 md:p-8 shadow-sm transition-colors`}>
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center text-xl font-black shadow-md shadow-blue-500/20">
                  <FontAwesomeIcon icon={faWallet} />
                </div>
                <div>
                  <div className="flex items-center gap-2.5">
                    <h1 className={`text-2xl font-black tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'} m-0`}>FINDIARY PRO</h1>
                    <Tag color="emerald" className="m-0 font-bold px-2.5 py-0.5 rounded-full border border-emerald-200 bg-emerald-50 text-emerald-700 text-xs">
                      <FontAwesomeIcon icon={faUserCheck} className="mr-1.5" />
                      Verified Account
                    </Tag>
                  </div>
                  <span className={`mt-1 flex items-center gap-1.5 text-xs font-semibold ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                    <FontAwesomeIcon icon={faCalendarDays} className="text-slate-400" />
                    {dayjs().format('dddd, MMMM D, YYYY')}
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2.5">
                {/* Currency Selector */}
                <Select
                  value={currencyKey}
                  onChange={val => setCurrencyKey(val)}
                  size="large"
                  className="w-28 rounded-xl font-extrabold"
                  suffixIcon={<FontAwesomeIcon icon={faCoins} className="text-amber-500" />}
                >
                  <Option value="USD">USD ($)</Option>
                  <Option value="EUR">EUR (€)</Option>
                  <Option value="GBP">GBP (£)</Option>
                  <Option value="PKR">PKR (Rs)</Option>
                </Select>

                {/* Dark/Light Mode Switch */}
                <Button
                  size="large"
                  onClick={() => setIsDarkMode(!isDarkMode)}
                  icon={<FontAwesomeIcon icon={isDarkMode ? faSun : faMoon} className={isDarkMode ? 'text-amber-400' : 'text-slate-600'} />}
                  className={`rounded-xl font-bold border ${isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-100 border-slate-200 text-slate-700'}`}
                >
                  {isDarkMode ? 'Light' : 'Dark'}
                </Button>

                <Button
                  icon={<FontAwesomeIcon icon={faWandMagicSparkles} className="text-purple-600" />}
                  size="large"
                  onClick={handleLoadSampleData}
                  loading={loading}
                  className="bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 font-bold rounded-xl shadow-2xs"
                >
                  Load Demo Data
                </Button>

                <Button
                  icon={<FontAwesomeIcon icon={faFileCsv} className="text-slate-600" />}
                  size="large"
                  onClick={exportToCSV}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 font-bold rounded-xl shadow-2xs"
                >
                  Export CSV
                </Button>

                <Button
                  type="primary"
                  size="large"
                  icon={<FontAwesomeIcon icon={faPlus} />}
                  onClick={handleOpenAddModal}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md shadow-blue-500/20 border-0 px-6"
                >
                  + Add Transaction
                </Button>

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

          {/* Achievement Badges Bar */}
          <AchievementBadges summary={convertedSummary} transactionCount={transactions.length} />

          {/* Stat Cards */}
          <SummaryCards
            summary={convertedSummary}
            activeFilter={filterType}
            onSelectFilter={type => setFilterType(type)}
            currencySymbol={currency.symbol}
          />

          {/* Financial Cash Flow Analytics Chart */}
          <FinancialAnalyticsChart summary={convertedSummary} currencySymbol={currency.symbol} />

          {/* Interactive Tools Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <QuickAddPresets onSuccess={loadData} />
            <BudgetMeter totalExpenses={convertedSummary.totalExpenses} />
          </div>

          {/* Control & Filter Toolbar */}
          <Card bordered={false} className={`shadow-sm rounded-2xl border ${isDarkMode ? 'border-slate-800 bg-slate-900' : 'border-slate-200/80 bg-white'}`}>
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-3">
                <Segmented
                  size="large"
                  value={filterType}
                  onChange={value => setFilterType(value)}
                  options={[
                    { label: <span className="font-bold px-2">ALL ENTRIES</span>, value: 'all' },
                    { label: <span className="font-bold text-emerald-700 px-2">💰 INCOME</span>, value: 'income' },
                    { label: <span className="font-bold text-rose-700 px-2">💸 EXPENSES</span>, value: 'expense' }
                  ]}
                  className="bg-slate-100 text-slate-700 font-bold p-1 rounded-xl"
                />

                <Input
                  placeholder="Filter category..."
                  prefix={<FontAwesomeIcon icon={faMagnifyingGlass} className="text-slate-400" />}
                  value={searchCategory}
                  onChange={e => setSearchCategory(e.target.value)}
                  style={{ width: 180 }}
                  size="large"
                  className="rounded-xl border-slate-300"
                  allowClear
                />

                <RangePicker
                  value={dateRange}
                  onChange={dates => setDateRange(dates)}
                  size="large"
                  className="rounded-xl border-slate-300"
                  format="YYYY-MM-DD"
                />
              </div>

              <div className="flex items-center gap-2">
                {hasActiveFilters && (
                  <Button
                    danger
                    type="dashed"
                    icon={<FontAwesomeIcon icon={faFilterCircleXmark} />}
                    onClick={handleClearFilters}
                    size="large"
                    className="rounded-xl font-bold"
                  >
                    Clear Filters
                  </Button>
                )}
                <Button
                  icon={<FontAwesomeIcon icon={faArrowsRotate} />}
                  onClick={loadData}
                  loading={loading}
                  size="large"
                  className="rounded-xl font-bold border-slate-300 text-slate-700"
                >
                  Refresh
                </Button>
              </div>
            </div>

            {/* Active Filter Badges */}
            {hasActiveFilters && (
              <div className="mt-3 pt-3 border-t border-slate-100 flex flex-wrap items-center gap-2 text-xs">
                <span className="font-bold text-slate-400">Active Filters:</span>
                {filterType !== 'all' && (
                  <Tag closable onClose={() => setFilterType('all')} color="blue" className="font-bold rounded-lg px-2 py-0.5">
                    Type: {filterType.toUpperCase()}
                  </Tag>
                )}
                {searchCategory.trim() !== '' && (
                  <Tag closable onClose={() => setSearchCategory('')} color="purple" className="font-bold rounded-lg px-2 py-0.5">
                    Category: &quot;{searchCategory}&quot;
                  </Tag>
                )}
                {dateRange !== null && (
                  <Tag closable onClose={() => setDateRange(null)} color="amber" className="font-bold rounded-lg px-2 py-0.5">
                    Range Filter
                  </Tag>
                )}
              </div>
            )}
          </Card>

          {/* Main Content Tabs: Table vs Analytics */}
          <Tabs
            defaultActiveKey="overview"
            size="large"
            className="light-tabs"
            items={[
              {
                key: 'overview',
                label: (
                  <span className={`font-extrabold px-3 py-1 flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
                    <FontAwesomeIcon icon={faListCheck} className="text-blue-600" />
                    Transactions Ledger ({currencyKey})
                  </span>
                ),
                children: (
                  <Card bordered={false} className={`shadow-sm rounded-2xl border ${isDarkMode ? 'border-slate-800 bg-slate-900' : 'border-slate-200/80 bg-white'} overflow-hidden p-0`}>
                    <Table
                      columns={columns}
                      dataSource={transactions}
                      rowKey="id"
                      loading={loading}
                      className="light-styled-table"
                      pagination={{
                        pageSize: 8,
                        showSizeChanger: true,
                        showTotal: renderPaginationTotal
                      }}
                      locale={{
                        emptyText: (
                          <div className="py-12 text-center space-y-3">
                            <span className="block font-extrabold text-slate-700 text-base">No transactions recorded yet!</span>
                            <span className="block text-slate-400 text-xs font-medium">Use 1-Click Quick Add buttons above or tap Load Demo Data to test.</span>
                            <Button type="primary" onClick={handleLoadSampleData} icon={<FontAwesomeIcon icon={faWandMagicSparkles} />} className="bg-blue-600 font-bold rounded-xl">
                              Load Demo Data
                            </Button>
                          </div>
                        )
                      }}
                    />
                  </Card>
                )
              },
              {
                key: 'analytics',
                label: (
                  <span className={`font-extrabold px-3 py-1 flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
                    <FontAwesomeIcon icon={faChartPie} className="text-emerald-600" />
                    Category Breakdown Insights
                  </span>
                ),
                children: <CategoryAnalytics transactions={transactions} />
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

          {/* Help & User Guide Modal */}
          <Modal
            title={<span className="font-extrabold text-slate-900 text-lg">💡 Quick User Guide</span>}
            open={isHelpOpen}
            onCancel={() => setIsHelpOpen(false)}
            footer={[
              <Button key="ok" type="primary" onClick={() => setIsHelpOpen(false)} className="bg-blue-600 font-bold rounded-xl">
                Got it!
              </Button>
            ]}
          >
            <div className="space-y-4 text-sm text-slate-700 py-2 font-medium">
              <div className="p-3.5 bg-blue-50/80 rounded-xl text-blue-900 border border-blue-100">
                Welcome to <strong>FINDIARY PRO</strong>! Here is how to use your financial diary:
              </div>

              <ol className="list-decimal list-inside space-y-2.5">
                <li><strong>Multi-Currency</strong>: Switch between USD $, EUR €, GBP £, and PKR Rs instantly!</li>
                <li><strong>Dark/Light Mode</strong>: Toggle between Dark 🌙 and Light ☀️ mode with 1 click.</li>
                <li><strong>1-Click Log</strong>: Use Quick Add preset buttons (☕ Coffee, 🛒 Groceries, 💼 Paycheck) for 1-second logging.</li>
                <li><strong>Interactive Card Filter</strong>: Click on <em>Total Income</em> or <em>Total Expenses</em> card to filter your ledger.</li>
                <li><strong>Budget Limit Goal</strong>: Click the gear ⚙️ icon on <em>Monthly Budget Goal</em> meter to adjust your limit.</li>
                <li><strong>Export CSV</strong>: Download your transaction ledger to Excel anytime via <em>Export CSV</em> button.</li>
              </ol>
            </div>
          </Modal>
        </div>
      </div>
    </ConfigProvider>
  );
};

export default Home;
