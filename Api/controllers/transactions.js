const { Transaction } = require('../db/mockDatabase');

exports.getTransactions = async (req, res) => {
  try {
    const { type, category, startDate, endDate, search } = req.query;
    let list = await Transaction.find();

    if (type && type !== 'all') {
      list = list.filter(t => t.type === type);
    }

    if (category) {
      list = list.filter(t => t.category && t.category.toLowerCase().includes(category.toLowerCase()));
    }

    if (search) {
      const queryStr = search.toLowerCase();
      list = list.filter(t =>
        (t.category && t.category.toLowerCase().includes(queryStr)) ||
        (t.description && t.description.toLowerCase().includes(queryStr))
      );
    }

    if (startDate) {
      list = list.filter(t => new Date(t.date) >= new Date(startDate));
    }
    if (endDate) {
      list = list.filter(t => new Date(t.date) <= new Date(endDate));
    }

    // Calculate Summary
    const all = await Transaction.find();
    const totalIncome = all
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + Number(t.amount || 0), 0);
    const totalExpenses = all
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + Number(t.amount || 0), 0);
    const balance = totalIncome - totalExpenses;

    return res.status(200).json({
      success: true,
      transactions: list,
      summary: {
        totalIncome,
        totalExpenses,
        balance,
        savingsRate: totalIncome > 0 ? Number(((balance / totalIncome) * 100).toFixed(1)) : 0
      }
    });
  } catch (err) {
    return res.status(500).json({ message: err.message || 'Failed to fetch transactions' });
  }
};

exports.getTransactionById = async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);
    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }
    return res.status(200).json({ success: true, transaction });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

exports.createTransaction = async (req, res) => {
  try {
    const { type, amount, category, description, date } = req.body;
    if (!type || !amount) {
      return res.status(400).json({ message: 'Type and amount are required' });
    }

    const newDoc = await Transaction.create({
      type,
      amount: Number(amount),
      category: category || 'General',
      description: description || '',
      date: date || new Date().toISOString()
    });

    return res.status(201).json({ success: true, transaction: newDoc });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

exports.updateTransaction = async (req, res) => {
  try {
    const updated = await Transaction.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) {
      return res.status(404).json({ message: 'Transaction not found' });
    }
    return res.status(200).json({ success: true, transaction: updated });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

exports.deleteTransaction = async (req, res) => {
  try {
    const deleted = await Transaction.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: 'Transaction not found' });
    }
    return res.status(200).json({ success: true, message: 'Transaction deleted successfully', transaction: deleted });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

exports.getAllTransactionsData = async () => {
  try {
    return await Transaction.find();
  } catch (err) {
    return [];
  }
};
