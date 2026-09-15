// In-memory database - replaces MongoDB completely
const bcrypt = require('bcryptjs');

let idCounter = 1;

// Mock data
const mockData = {
  users: [
    {
      _id: '1',
      id: '1',
      email: 'test@meblabs.com',
      password: bcrypt.hashSync('testtest', 8),
      firstName: 'Test',
      lastName: 'User',
      roles: ['admin']
    }
  ],
  transactions: [
    {
      _id: '1',
      id: '1',
      userId: '1',
      type: 'income',
      amount: 3500.0,
      category: 'Salary',
      description: 'Monthly Software Engineer Salary',
      date: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      _id: '2',
      id: '2',
      userId: '1',
      type: 'expense',
      amount: 150.0,
      category: 'Groceries',
      description: 'Supermarket Groceries',
      date: new Date(Date.now() - 86400000).toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ]
};

const Transaction = {
  find: async (query = {}) => {
    let result = [...mockData.transactions];
    if (query.userId) result = result.filter(t => t.userId === query.userId);
    if (query.type) result = result.filter(t => t.type === query.type);
    if (query.category) {
      result = result.filter(t => t.category && t.category.toLowerCase().includes(query.category.toLowerCase()));
    }
    return result;
  },

  findById: async id => {
    return mockData.transactions.find(t => String(t.id) === String(id) || String(t._id) === String(id)) || null;
  },

  create: async data => {
    const nextId = String(++idCounter + Date.now());
    const newDoc = {
      _id: nextId,
      id: nextId,
      userId: data.userId || '1',
      type: data.type,
      amount: Number(data.amount),
      category: data.category || 'General',
      description: data.description || '',
      date: data.date ? new Date(data.date).toISOString() : new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    mockData.transactions.unshift(newDoc);
    return newDoc;
  },

  findByIdAndUpdate: async (id, updateData, options = {}) => {
    const index = mockData.transactions.findIndex(t => String(t.id) === String(id) || String(t._id) === String(id));
    if (index === -1) return null;

    const current = mockData.transactions[index];
    const updatedDoc = {
      ...current,
      ...updateData,
      amount: updateData.amount !== undefined ? Number(updateData.amount) : current.amount,
      updatedAt: new Date().toISOString()
    };

    mockData.transactions[index] = updatedDoc;
    return options.new ? updatedDoc : current;
  },

  findByIdAndDelete: async id => {
    const index = mockData.transactions.findIndex(t => String(t.id) === String(id) || String(t._id) === String(id));
    if (index === -1) return null;
    const deletedDoc = mockData.transactions.splice(index, 1)[0];
    return deletedDoc;
  }
};

const User = {
  findOne: async query => {
    if (query.email) {
      return mockData.users.find(u => u.email === query.email) || null;
    }
    return null;
  },

  findById: async id => {
    return mockData.users.find(u => u.id === id || u._id === id) || null;
  }
};

const connectDB = () => {
  console.log('Mock database initialized successfully.');
};

module.exports = {
  connectDB,
  mockData,
  Transaction,
  User,
  mockDB: {
    reset: () => {
      mockData.transactions = [
        {
          _id: '1',
          id: '1',
          userId: '1',
          type: 'income',
          amount: 3500.0,
          category: 'Salary',
          description: 'Monthly Software Engineer Salary',
          date: new Date().toISOString(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ];
    }
  }
};
