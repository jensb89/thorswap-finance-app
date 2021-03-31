import { EtherscanProvider } from '@ethersproject/providers'
import { getDecimal } from '@xchainjs/xchain-ethereum'
import {
  BNBChain,
  BTCChain,
  THORChain,
  ETHChain,
  LTCChain,
  assetFromString,
  assetToString,
  Chain,
  currencySymbolByAsset,
  AssetBNB,
  AssetBTC,
  AssetETH,
  AssetLTC,
  AssetBCH,
  AssetRuneNative,
  BCHChain,
} from '@xchainjs/xchain-util'

import { ETHERSCAN_API_KEY, NETWORK_TYPE } from 'multichain-sdk/config'

import {
  DEFAULT_CHAIN_DECIMAL,
  THORCHAIN_DECIMAL,
  BNB_DECIMAL,
  BTC_DECIMAL,
  ETH_DECIMAL,
  LTC_DECIMAL,
  BCH_DECIMAL,
} from '../constants/decimals'

export type AssetNetwork = 'mainnet' | 'testnet'

export type AssetObj = {
  chain: string
  symbol: string
  ticker: string
}

export interface IAsset {
  readonly chain: Chain
  readonly symbol: string
  readonly ticker: string
  decimal: number

  // TODO: add asset icon url

  getAssetObj(): AssetObj
  toString(): string
  currencySymbol(): string
  eq(asset: Asset): boolean
  isRUNE(): boolean
  isBNB(): boolean
  sortsBefore(asset: Asset): number
}

export class Asset implements IAsset {
  public readonly chain: Chain

  public readonly symbol: string

  public readonly ticker: string

  public decimal: number

  // created for USD pricing
  public static USD(): Asset {
    return new Asset(THORChain, 'USD-USD')
  }

  public static BNB(): Asset {
    return new Asset(AssetBNB.chain, AssetBNB.symbol)
  }

  public static RUNE(): Asset {
    return new Asset(AssetRuneNative.chain, AssetRuneNative.symbol)
  }

  public static BTC(): Asset {
    return new Asset(AssetBTC.chain, AssetBTC.symbol)
  }

  public static ETH(): Asset {
    return new Asset(AssetETH.chain, AssetETH.symbol)
  }

  public static LTC(): Asset {
    return new Asset(AssetLTC.chain, AssetLTC.symbol)
  }

  public static BCH(): Asset {
    return new Asset(AssetBCH.chain, AssetBCH.symbol)
  }

  public static fromAssetString(asset: string): Asset | null {
    const { chain, symbol } = assetFromString(asset) || {}

    if (chain && symbol) {
      return new Asset(chain, symbol.toUpperCase())
    }

    return null
  }

  public static async getDecimalByAsset(asset: Asset): Promise<number> {
    const { chain, symbol, ticker } = asset
    if (chain === BNBChain) return BNB_DECIMAL
    if (chain === BTCChain) return BTC_DECIMAL
    if (chain === THORChain) return THORCHAIN_DECIMAL
    if (chain === LTCChain) return LTC_DECIMAL
    if (chain === BCHChain) return BCH_DECIMAL

    if (chain === ETHChain) {
      if (symbol === 'ETH' && ticker === 'ETH') {
        return ETH_DECIMAL
      }

      const provider = new EtherscanProvider(NETWORK_TYPE, ETHERSCAN_API_KEY)
      const decimal = await getDecimal(asset.getAssetObj(), provider)

      return decimal
    }

    return DEFAULT_CHAIN_DECIMAL
  }

  public static getDecimalByChain(chain: Chain): number {
    if (chain === BNBChain) return BNB_DECIMAL
    if (chain === BTCChain) return BTC_DECIMAL
    if (chain === THORChain) return THORCHAIN_DECIMAL
    if (chain === LTCChain) return LTC_DECIMAL
    if (chain === BCHChain) return BCH_DECIMAL

    if (chain === ETHChain) {
      return ETH_DECIMAL
    }

    return DEFAULT_CHAIN_DECIMAL
  }

  constructor(chain: Chain, symbol: string) {
    this.chain = chain
    this.symbol = symbol
    this.ticker = Asset.getTicker(symbol)

    this.decimal = Asset.getDecimalByChain(chain)
  }

  public setDecimal = async () => {
    this.decimal = await Asset.getDecimalByAsset(this)
  }

  public static getTicker(symbol: string): string {
    return symbol.split('-')[0]
  }

  public getAssetObj() {
    return { chain: this.chain, symbol: this.symbol, ticker: this.ticker }
  }

  toString(): string {
    return assetToString(this.getAssetObj())
  }

  currencySymbol(): string {
    return currencySymbolByAsset(this.getAssetObj())
  }

  eq(asset: Asset): boolean {
    return (
      this.chain === asset.chain &&
      this.symbol.toUpperCase() === asset.symbol.toUpperCase() &&
      this.ticker.toUpperCase() === asset.ticker.toUpperCase()
      // this.decimal === asset.decimal
    )
  }

  isRUNE(): boolean {
    return this.eq(Asset.RUNE())
  }

  isBNB(): boolean {
    return this.eq(Asset.BNB())
  }

  isETH(): boolean {
    return this.eq(Asset.ETH())
  }

  sortsBefore(asset: Asset): number {
    if (this.eq(asset)) return 0

    if (this.chain !== asset.chain) {
      if (this.chain < asset.chain) return 1
      if (this.chain < asset.chain) return -1
    }

    if (this.symbol < asset.symbol) return 1
    if (this.symbol > asset.symbol) return -1

    return 1
  }
}
