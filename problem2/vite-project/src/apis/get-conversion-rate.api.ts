export type TPostConvertCurrenciesData = {
  currentCurrencyCode: string;
  currentCurrencyAmount: number;
  targetCurrencyCode: string;
  targetCurrencyAmount: number;
};

export const postConvertCurrenciesAPI = (data: TPostConvertCurrenciesData) => {
  return new Promise<TPostConvertCurrenciesData>((resolve) => {
    const timeoutId = setTimeout(() => {
      resolve(data);
      clearTimeout(timeoutId);
    }, 500);
  });
};
