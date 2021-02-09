import {
  Client as BncClient,
  MultiTransfer,
  Network,
} from '@xchainjs/xchain-binance'
import { TxHash, Balance } from '@xchainjs/xchain-client'
import { baseAmount, Chain, BNBChain } from '@xchainjs/xchain-util'

import { AmountType, Amount, Asset, AssetAmount } from '../entities'
import { IClient } from './client'
import { TxParams, MultiSendParams } from './types'

export interface IBnbChain extends IClient {
  getClient(): BncClient
  multiSend(params: MultiSendParams): Promise<TxHash>
}

export class BnbChain implements IBnbChain {
  private balances: AssetAmount[] = []

  private client: BncClient

  public readonly chain: Chain

  constructor({
    network = 'testnet',
    phrase,
  }: {
    network?: Network
    phrase: string
  }) {
    this.chain = BNBChain
    this.client = new BncClient({
      network,
      phrase,
    })
  }

  /**
   * get xchain-binance client
   */
  getClient(): BncClient {
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
  }

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
  }

  getAssetBalance = async (asset: Asset): Promise<AssetAmount> => {
    try {
      await this.loadBalance()

      const assetBalance = this.balances.find((data: AssetAmount) =>
        data.asset.eq(asset),
      )

      if (!assetBalance)
        return new AssetAmount(asset, Amount.fromAssetAmount(0, asset.decimal))

      return assetBalance
    } catch (error) {
      return Promise.reject(error)
    }
  }

  /**
   * transfer on binance chain
   * @param {TxParams} tx transfer parameter
   */
  transfer = async (tx: TxParams): Promise<TxHash> => {
    // use xchainjs-client standard internally
    try {
      const { assetAmount, recipient, memo } = tx
      const { asset } = assetAmount
      const amount = baseAmount(assetAmount.amount.baseAmount)

      return await this.client.transfer({
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
  }

  /**
   * multiSend on binance chain
   * @param {MultiSendParams} params transfer parameter
   */
  multiSend = async (params: MultiSendParams): Promise<TxHash> => {
    // use xchainjs-client standard internally
    try {
      const { assetAmount1, assetAmount2, recipient, memo } = params

      const transactions: MultiTransfer[] = [
        {
          to: recipient,
          coins: [
            {
              asset: {
                chain: assetAmount1.asset.chain,
                symbol: assetAmount1.asset.symbol,
                ticker: assetAmount1.asset.ticker,
              },
              amount: baseAmount(assetAmount1.amount.baseAmount),
            },
            {
              asset: {
                chain: assetAmount2.asset.chain,
                symbol: assetAmount2.asset.symbol,
                ticker: assetAmount2.asset.ticker,
              },
              amount: baseAmount(assetAmount2.amount.baseAmount),
            },
          ],
        },
      ]

      return await this.client.multiSend({
        transactions,
        memo,
      })
    } catch (error) {
      return Promise.reject(error)
    }
  }
}
