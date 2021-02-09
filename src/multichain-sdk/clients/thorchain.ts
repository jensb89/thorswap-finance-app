import { TxHash, Balance, Network } from '@xchainjs/xchain-client'
import { Client as ThorClient } from '@xchainjs/xchain-thorchain'
import { baseAmount, Chain, THORChain } from '@xchainjs/xchain-util'

import { AmountType, Amount, Asset, AssetAmount } from '../entities'
import { IClient } from './client'
import { TxParams } from './types'

export type DepositParam = {
  assetAmount: AssetAmount;
  memo?: string;
};

export interface IThorChain extends IClient {
  getClient(): ThorClient;
  deposit(tx: DepositParam): Promise<TxHash>;
}

export class ThorChain implements IThorChain {
  private balances: AssetAmount[] = [];

  private client: ThorClient;

  public readonly chain: Chain;

  constructor({
    network = 'testnet',
    phrase,
  }: {
    network?: Network;
    phrase: string;
  }) {
    this.chain = THORChain
    this.client = new ThorClient({
      network,
      phrase,
    })
  }

  /**
   * get xchain-binance client
   */
  getClient(): ThorClient {
    return this.client
  }

  get balance() {
    return this.balances
  }

  loadBalance = async (): Promise<AssetAmount[]> => {
    try {
      const balances: Balance[] = await this.client.getBalance()

      this.balances = balances.map((data: Balance) => {
        const { asset, amount } = data

        const assetObj = new Asset(asset.chain, asset.symbol)
        const amountObj = new Amount(
          amount.amount(),
          AmountType.BASE_AMOUNT,
          assetObj.decimal,
        )

        return new AssetAmount(assetObj, amountObj)
      })

      return this.balances
    } catch (error) {
      return Promise.reject(error)
    }
  };

  hasAmountInBalance = async (assetAmount: AssetAmount): Promise<boolean> => {
    try {
      await this.loadBalance()

      const assetBalance = this.balances.find((data: AssetAmount) =>
        data.asset.eq(assetAmount.asset),
      )

      if (!assetBalance) return false

      return assetBalance.amount.gte(assetAmount.amount)
    } catch (error) {
      return Promise.reject(error)
    }
  };

  getAssetBalance = async (asset: Asset): Promise<AssetAmount> => {
    try {
      await this.loadBalance()

      const assetBalance = this.balances.find((data: AssetAmount) =>
        data.asset.eq(asset),
      )

      if (!assetBalance) return new AssetAmount(asset, Amount.fromAssetAmount(0, asset.decimal))

      return assetBalance
    } catch (error) {
      return Promise.reject(error)
    }
  };

  /**
   * transfer on binance chain
   * @param {TxParams} tx transfer parameter
   */
  transfer = async (tx: TxParams): Promise<TxHash> => {
    // use xchainjs-client standard internally
    try {
      const { assetAmount, recipient, memo } = tx
      const asset = assetAmount.asset
      const amount = baseAmount(assetAmount.amount.baseAmount)

      return this.client.transfer({
        asset: {
          chain: asset.chain,
          symbol: asset.symbol,
          ticker: asset.ticker,
        },
        amount,
        recipient,
        memo,
      })
    } catch (error) {
      return Promise.reject(error)
    }
  };

  async deposit(tx: DepositParam): Promise<TxHash> {
    try {
      const { assetAmount, memo } = tx
      const asset = assetAmount.asset
      const amount = baseAmount(assetAmount.amount.baseAmount)

      if (memo) {
        return this.client.deposit({
          asset: {
            chain: asset.chain,
            symbol: asset.symbol,
            ticker: asset.ticker,
          },
          amount,
          memo,
        })
      } else {
        throw new Error('Invalid Memo')
      }
    } catch (error) {
      return Promise.reject(error)
    }
  }
}
