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
  AssetRuneNative,
} from '@xchainjs/xchain-util'

import {
  DEFAULT_CHAIN_DECIMAL,
  THORCHAIN_DECIMAL,
  BNB_DECIMAL,
  BTC_DECIMAL,
  ETH_DECIMAL,
  LTC_DECIMAL,
} from '../constants/decimals'

export type AssetNetwork = 'mainnet' | 'testnet'

export interface IAsset {
  readonly chain: Chain
  readonly symbol: string
  readonly ticker: string
  readonly decimal: number

  // TODO: add asset icon url

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

  public readonly decimal: number

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

  public static fromAssetString(asset: string): Asset | null {
    const { chain, symbol } = assetFromString(asset) || {}

    if (chain && symbol) {
      return new Asset(chain, symbol)
    }

    return null
  }

  public static getDecimalByChain(chain: Chain): number {
    if (chain === BNBChain) return BNB_DECIMAL
    if (chain === BTCChain) return BTC_DECIMAL
    if (chain === THORChain) return THORCHAIN_DECIMAL
    if (chain === ETHChain) return ETH_DECIMAL
    if (chain === LTCChain) return LTC_DECIMAL

    return DEFAULT_CHAIN_DECIMAL
  }

  constructor(chain: Chain, symbol: string) {
    this.chain = chain
    this.symbol = symbol
    this.ticker = Asset.getTicker(symbol)
    this.decimal = Asset.getDecimalByChain(chain)
  }

  public static getTicker(symbol: string): string {
    return symbol.split('-')[0]
  }

  private getAssetObj() {
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
      this.symbol === asset.symbol &&
      this.ticker === asset.ticker &&
      this.decimal === asset.decimal
    )
  }

  isRUNE(): boolean {
    return this.eq(Asset.RUNE())
  }

  isBNB(): boolean {
    return this.eq(Asset.BNB())
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
