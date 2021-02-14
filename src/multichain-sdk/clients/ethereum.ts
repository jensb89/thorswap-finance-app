import { TxHash, Balance, Network } from '@xchainjs/xchain-client'
import { Client as EthClient } from '@xchainjs/xchain-ethereum'
import { baseAmount, Chain, ETHChain } from '@xchainjs/xchain-util'

import { ETHERSCAN_API_KEY } from '../config'
import { AmountType, Amount, Asset, AssetAmount } from '../entities'
import { IClient } from './client'
import { TxParams } from './types'

export interface IEthChain extends IClient {
  getClient(): EthClient
}

export class EthChain implements IEthChain {
  private balances: AssetAmount[] = []

  private client: EthClient

  public readonly chain: Chain

  constructor({
    network = 'testnet',
    phrase,
  }: {
    network?: Network
    phrase: string
  }) {
    this.chain = ETHChain
    this.client = new EthClient({
      network,
      phrase,
      etherscanApiKey: ETHERSCAN_API_KEY,
    })
  }

  /**
   * get xchain-binance client
   */
  getClient(): EthClient {
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
      const { assetAmount, recipient, memo, feeOptionKey = 'fastest' } = tx
      const { asset } = assetAmount
      const amount = baseAmount(assetAmount.amount.baseAmount)

      const txHash = await this.client.transfer({
        asset: {
          chain: asset.chain,
          symbol: asset.symbol,
          ticker: asset.ticker,
        },
        amount,
        recipient,
        memo,
        feeOptionKey,
      })

      return txHash
    } catch (error) {
      return Promise.reject(error)
    }
  }
}
