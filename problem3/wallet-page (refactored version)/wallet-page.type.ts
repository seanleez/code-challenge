export interface IWalletBalance {
  currency: string;
  amount: number;
  blockchain: string;
}
export interface IFormattedWalletBalance extends IWalletBalance {
  formatted: string;
  usdValue: number;
}

export interface IWalletPageProps extends BoxProps {}
