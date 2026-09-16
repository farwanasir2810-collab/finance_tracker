/**
 * Money & Currency Utility Module (Minor-Unit Integer Math)
 * Stored as integer minor units (e.g., 125050 paisa / cents = 1,250.50)
 * Prevents floating point inaccuracy (0.1 + 0.2 != 0.3)
 */

const CURRENCIES = {
  PKR: { symbol: 'Rs ', decimals: 2, defaultRate: 1 },
  USD: { symbol: '$', decimals: 2, defaultRate: 0.0036 },
  EUR: { symbol: '€', decimals: 2, defaultRate: 0.0033 },
  GBP: { symbol: '£', decimals: 2, defaultRate: 0.0028 }
};

/**
 * Convert major currency units (e.g., 1250.50) to minor units (125050)
 */
function toMinorUnits(amount, currency = 'PKR') {
  const num = Number(amount) || 0;
  const decimals = CURRENCIES[currency]?.decimals ?? 2;
  return Math.round(num * Math.pow(10, decimals));
}

/**
 * Convert minor units (125050) to major units (1250.50)
 */
function fromMinorUnits(minorUnits, currency = 'PKR') {
  const num = Number(minorUnits) || 0;
  const decimals = CURRENCIES[currency]?.decimals ?? 2;
  return num / Math.pow(10, decimals);
}

/**
 * Format minor units into human readable currency string
 */
function formatMoney(minorUnits, currency = 'PKR') {
  const major = fromMinorUnits(minorUnits, currency);
  const info = CURRENCIES[currency] || CURRENCIES.PKR;
  return `${info.symbol}${major.toLocaleString('en-US', {
    minimumFractionDigits: info.decimals,
    maximumFractionDigits: info.decimals
  })}`;
}

/**
 * Convert minor units from source currency to target currency at exchange rate
 */
function convertCurrency(minorUnits, fromCurrency = 'PKR', toCurrency = 'PKR', customRate = null) {
  if (fromCurrency === toCurrency) return minorUnits;
  
  const fromInfo = CURRENCIES[fromCurrency] || CURRENCIES.PKR;
  const toInfo = CURRENCIES[toCurrency] || CURRENCIES.PKR;
  
  const rate = customRate || (toInfo.defaultRate / fromInfo.defaultRate);
  const majorFrom = fromMinorUnits(minorUnits, fromCurrency);
  const majorTo = majorFrom * rate;
  
  return toMinorUnits(majorTo, toCurrency);
}

module.exports = {
  CURRENCIES,
  toMinorUnits,
  fromMinorUnits,
  formatMoney,
  convertCurrency
};
