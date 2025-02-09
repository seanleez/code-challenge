import currency from 'currency.js';

export const formatCurrency = (value: number, options?: currency.Options) => {
  return currency(value, {
    symbol: '',
    separator: ',',
    decimal: '.',
    precision: 6,
    ...options,
  }).format();
};
