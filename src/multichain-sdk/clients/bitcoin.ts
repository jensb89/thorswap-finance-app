import { Client as BtcClient, Network } from '@xchainjs/xchain-bitcoin'
import { TxHash, Balance, FeeOptionKey } from '@xchainjs/xchain-client'
import { baseAmount, Chain, BTCChain } from '@xchainjs/xchain-util'

import {
  BLOCKCHAIR_API_KEY,
  BLOCKCHAIR_TESTNET,
  BLOCKCHAIR_MAINNET,
} from '../config'
import { AmountType, Amount, Asset, AssetAmount } from '../entities'
import { IClient } from './client'
import { TxParams } from './types'

export interface IBtcChain extends IClient {
  getClient(): BtcClient;
}

export class BtcChain implements IBtcChain {
  private balances: AssetAmount[] = [];

  private client: BtcClient;

  public readonly chain: Chain;

  constructor({
    network = 'testnet',
    phrase,
  }: {
    network?: Network;
    phrase: string;
  }) {
    this.chain = BTCChain
    const blockchairUrl =
      network === 'testnet' ? BLOCKCHAIR_TESTNET : BLOCKCHAIR_MAINNET

    this.client = new BtcClient({
      network,
      phrase,
      nodeUrl: blockchairUrl,
      nodeApiKey: BLOCKCHAIR_API_KEY,
    })
  }

  /**
   * get xchain-binance client
   */
  getClient(): BtcClient {
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
      const { assetAmount, recipient, memo, feeOptionKey = 'fastest' } = tx
      const asset = assetAmount.asset
      const amount = baseAmount(assetAmount.amount.baseAmount)
      const feeRates = await this.client.getFeeRates()
      const feeRate = feeRates[feeOptionKey]

      return this.client.transfer({
        asset: {
          chain: asset.chain,
          symbol: asset.symbol,
          ticker: asset.ticker,
        },
        amount,
        recipient,
        memo,
        feeRate,
      })
    } catch (error) {
      return Promise.reject(error)
    }
  };
}
