import Api from '../helpers/core/Api';

export const fetchNetWorth = async (currency = 'PKR') => {
  const response = await Api.get('/api/financial/net-worth', { params: { currency } });
  return response.data;
};

export const fetchForecast = async (currency = 'PKR') => {
  const response = await Api.get('/api/financial/forecast', { params: { currency } });
  return response.data;
};

export const calculateDebtPayoffApi = async data => {
  const response = await Api.post('/api/financial/debt-planner', data);
  return response.data;
};

export const fetchRecurringDetection = async () => {
  const response = await Api.get('/api/financial/recurring');
  return response.data;
};

export const queryAICopilot = async (query, currency = 'PKR') => {
  const response = await Api.post('/api/financial/ai-query', { query, currency });
  return response.data;
};
