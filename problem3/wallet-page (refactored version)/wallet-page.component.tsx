import {
  IFormattedWalletBalance,
  IWalletPageProps,
  IWalletBalance,
} from './wallet-page.type';
import { getPriority } from './wallet-page.util';

export const WalletPage: React.FC<IWalletPageProps> = ({ ...rest }) => {
  const balances = useWalletBalances();
  const prices = usePrices();

  const formattedBalances = useMemo<IFormattedWalletBalance[]>(() => {
    return balances
      .filter((balance: IWalletBalance) => {
        const balancePriority = getPriority(balance.blockchain);
        return balancePriority > -99 && balance.amount > 0;
      })
      .sort((lhs: IWalletBalance, rhs: IWalletBalance) => {
        const leftPriority = getPriority(lhs.blockchain);
        const rightPriority = getPriority(rhs.blockchain);
        return rightPriority - leftPriority;
      })
      .map((balance: IWalletBalance) => ({
        ...balance,
        formatted: balance.amount.toFixed(),
        usdValue: prices[balance.currency] * balance.amount,
      }));
  }, [balances, prices]);

  return (
    <div {...rest}>
      {formattedBalances.map((balance: IFormattedWalletBalance, index: number) => (
        <WalletRow 
          className={classes.row}
          key={index}
          amount={balance.amount}
          usdValue={balance.usdValue}
          formattedAmount={balance.formatted}
        />
      ))}
    </div>
  );
};
