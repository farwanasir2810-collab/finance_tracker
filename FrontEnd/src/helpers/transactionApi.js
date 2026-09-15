import Api from './core/Api';

export const fetchTransactions = async params => {
  const response = await Api.get('/api/transactions', { params });
  return response.data;
};

export const createTransaction = async data => {
  const response = await Api.post('/api/transactions', data);
  return response.data;
};

export const updateTransaction = async (id, data) => {
  const response = await Api.put(`/api/transactions/${id}`, data);
  return response.data;
};

export const deleteTransaction = async id => {
  const response = await Api.delete(`/api/transactions/${id}`);
  return response.data;
};
