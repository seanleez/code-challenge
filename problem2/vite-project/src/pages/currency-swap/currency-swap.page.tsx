import React, { useEffect, useMemo, useState } from 'react';
import { CurrencyDropdown, Spinner, SVGIcon } from '../../components';
import { CURRENCIES } from '../../const';
import './currency-swap.style.scss';
import { useForm } from 'react-hook-form';
import { TCurrency } from '../../type';
import { postConvertCurrenciesAPI } from '../../apis';
import { formatCurrency } from '../../util';
import { useToast } from '../../contexts';

export interface TFormData {
  currentCurrency: TCurrency;
  currentCurrencyAmt: number | undefined;
  targetCurrency: TCurrency;
  targetCurrencyAmt: number | undefined;
  currenciesBalance: Record<string, number>;
}

const classNamePrefix = 'currency-swap-page';

const DEFAULT_MOCK_CURRENCIES_BALANCE = {
  BUSD: 20000,
  ETH: 1400,
  WBTC: 150,
};

export const CurrencySwapPage: React.FC = React.memo(() => {
  const { formState, register, setValue, getValues, watch, handleSubmit } = useForm<TFormData>({
    reValidateMode: 'onChange',
    defaultValues: {
      currentCurrency: CURRENCIES[0],
      currentCurrencyAmt: undefined,
      targetCurrency: CURRENCIES[1],
      targetCurrencyAmt: undefined,
      currenciesBalance: localStorage.getItem('currenciesBalance')
        ? JSON.parse(localStorage.getItem('currenciesBalance') ?? '{}')
        : DEFAULT_MOCK_CURRENCIES_BALANCE,
    },
  });

  const { showToast } = useToast();

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const totalBalanceInUSD = useMemo(() => {
    return Object.entries(watch('currenciesBalance')).reduce((acc, [currency, balance]) => {
      const currencyInfo = CURRENCIES.find((cur) => cur.currency === currency);
      return acc + (balance * (currencyInfo?.price ?? 0) || 0);
    }, 0);
  }, [watch('currenciesBalance')]);

  const isAbleToInterchangeCurrencies = useMemo(() => {
    return [watch('currentCurrency.currency'), watch('targetCurrency.currency')].every(
      (cur) => !!watch('currenciesBalance')[cur]
    );
  }, [
    watch('currentCurrency.currency'),
    watch('targetCurrency.currency'),
    watch('currenciesBalance'),
  ]);

  const handleInterchangeCurrencies = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();

    const _tempCurrency = getValues('currentCurrency');
    const _tempAmt = getValues('currentCurrencyAmt');

    setValue('currentCurrency', getValues('targetCurrency'));
    setValue('targetCurrency', _tempCurrency);
    setValue('currentCurrencyAmt', getValues('targetCurrencyAmt'));
    setValue('targetCurrencyAmt', _tempAmt);
  };

  const handleSwapCurrencies = async (data: TFormData) => {
    const { currentCurrency, targetCurrency, currentCurrencyAmt, targetCurrencyAmt } = data;

    setIsLoading(true);

    try {
      await postConvertCurrenciesAPI({
        currentCurrencyCode: currentCurrency.currency,
        targetCurrencyCode: targetCurrency.currency,
        currentCurrencyAmount: currentCurrencyAmt ?? 0,
        targetCurrencyAmount: targetCurrencyAmt ?? 0,
      });

      setValue('currenciesBalance', {
        ...watch('currenciesBalance'),
        [currentCurrency.currency]:
          watch('currenciesBalance')[currentCurrency.currency] - (currentCurrencyAmt ?? 0),
        [targetCurrency.currency]:
          (watch('currenciesBalance')[targetCurrency.currency] ?? 0) + (targetCurrencyAmt ?? 0),
      });

      setValue('currentCurrencyAmt', undefined);
      setValue('targetCurrencyAmt', undefined);
      showToast('Swap successfully!', 'success');
    } catch (error) {
      console.error(error);
      showToast('Swap failed!', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!watch('currentCurrencyAmt')) {
      setValue('targetCurrencyAmt', undefined);
      return;
    }

    setValue(
      'targetCurrencyAmt',
      ((watch('currentCurrencyAmt') ?? 0) * (watch('currentCurrency.price') ?? 1)) /
        (watch('targetCurrency.price') ?? 1)
    );
  }, [watch('currentCurrencyAmt')]);

  useEffect(() => {
    localStorage.setItem(
      'currenciesBalance',
      JSON.stringify(watch('currenciesBalance') ?? DEFAULT_MOCK_CURRENCIES_BALANCE)
    );
  }, [watch('currenciesBalance')]);

  return (
    <div className={classNamePrefix}>
      <div className={`${classNamePrefix}__container`}>
        <div className={`${classNamePrefix}__balance`}>
          <div className={`${classNamePrefix}__balance-header`}>
            <div className={`${classNamePrefix}__balance-header-title`}>Balance</div>
            <div className={`${classNamePrefix}__balance-header-total`}>
              {formatCurrency(totalBalanceInUSD, { symbol: '$' })}
            </div>
          </div>
          <div className={`${classNamePrefix}__balance-body`}>
            {Object.entries(watch('currenciesBalance')).map(([currency, balance]) => {
              const currencyInfo = CURRENCIES.find((cur) => cur.currency === currency);
              const balanceInUSD = balance * (currencyInfo?.price ?? 0) || 0;

              return (
                <div key={currency} className={`${classNamePrefix}__balance-item`}>
                  <div className={`${classNamePrefix}__balance-item-currency`}>
                    <SVGIcon name={currency} />
                    <span>{currency}</span>
                  </div>
                  <div className={`${classNamePrefix}__balance-item-amount`}>
                    <span className={`${classNamePrefix}__balance-item-amount-origin`}>
                      {formatCurrency(balance)}
                    </span>
                    <span className={`${classNamePrefix}__balance-item-amount-usd`}>
                      {formatCurrency(balanceInUSD, { symbol: '$' })}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <form className={`${classNamePrefix}__form`} onSubmit={handleSubmit(handleSwapCurrencies)}>
          <div className={`${classNamePrefix}__form-ribbon`}>
            <label htmlFor="amount" className="form-label">
              You give
            </label>
            <div className={`${classNamePrefix}__form-ribbon-body`}>
              <input
                type="number"
                className={`form-control ${
                  formState.errors.currentCurrencyAmt ? 'is-invalid' : ''
                }`}
                {...register('currentCurrencyAmt', {
                  min: { value: 0, message: 'Amount must be greater than 0' },
                  validate: (value) => {
                    const balance =
                      watch('currenciesBalance')[watch('currentCurrency').currency] || 0;
                    return (value ?? 0) <= balance || 'Amount cannot exceed balance';
                  },
                })}
              />
              <CurrencyDropdown
                currenciesList={CURRENCIES.filter((cur) =>
                  Object.keys(watch('currenciesBalance')).includes(cur.currency)
                )}
                selectedCurrency={watch('currentCurrency')}
                onSelectCurrency={(cur) => setValue('currentCurrency', cur)}
              />
            </div>
            {formState.errors.currentCurrencyAmt && (
              <div className={`${classNamePrefix}__form-ribbon-error`}>
                {formState.errors.currentCurrencyAmt?.message}
              </div>
            )}
          </div>
          <div className={`${classNamePrefix}__form-ribbon`}>
            <label htmlFor="amount" className="form-label">
              You receive
            </label>
            <div className={`${classNamePrefix}__form-ribbon-body`}>
              <input
                className="form-control"
                readOnly
                value={
                  watch('targetCurrencyAmt') ? formatCurrency(watch('targetCurrencyAmt') ?? 0) : ''
                }
              />
              <CurrencyDropdown
                selectedCurrency={watch('targetCurrency')}
                onSelectCurrency={(cur) => setValue('targetCurrency', cur)}
              />
            </div>
          </div>

          <div className={`${classNamePrefix}__form-note`}>
            <span>{`1 ${watch('currentCurrency.currency')} = ${formatCurrency(
              watch('currentCurrency.price') / watch('targetCurrency.price')
            )} ${watch('targetCurrency.currency')}`}</span>
            <i className="bi bi-arrow-down-up"></i>
          </div>

          <button
            className={`${classNamePrefix}__form-swap-btn btn btn-dark ${
              formState.errors.currentCurrencyAmt ? 'is-error' : ''
            }`}
            disabled={!isAbleToInterchangeCurrencies}
            onClick={(event) => handleInterchangeCurrencies(event)}
          >
            <i className="bi bi-arrow-down-up"></i>
          </button>

          <button type="submit" className="btn btn-warning">
            Swap
          </button>
        </form>
      </div>

      {isLoading && <Spinner />}
    </div>
  );
});
