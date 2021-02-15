import { PoolDetail } from 'midgard-sdk'
import invariant from 'tiny-invariant'

import { MULTICHAIN_DECIMAL } from 'multichain-sdk/constants'

import { Amount } from './amount'
import { Asset } from './asset'

export interface IPool {
  readonly asset: Asset
  readonly runeDepth: Amount
  readonly assetDepth: Amount

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  readonly detail: any

  assetPriceInRune: Amount
  runePriceInAsset: Amount
  involvesAsset(asset: Asset): boolean
  priceOf(asset: Asset): Amount
  depthOf(asset: Asset): Amount
}

export class Pool implements IPool {
  public readonly asset: Asset

  public readonly runeDepth: Amount

  public readonly assetDepth: Amount

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public readonly detail: any

  // get Pool by non-rune asset
  public static byAsset(asset: Asset, pools: Pool[]): Pool | undefined {
    if (!asset.isRUNE()) {
      return pools.find((pool: Pool) => asset.eq(pool.asset))
    }
  }

  public static fromPoolData(
    {
      asset,
      runeDepth,
      assetDepth,
    }: {
      asset: string
      runeDepth: string
      assetDepth: string
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    detail: PoolDetail,
  ): Pool | null {
    const assetObj = Asset.fromAssetString(asset)

    if (assetObj && runeDepth && assetDepth) {
      const runeAmount = Amount.fromBaseAmount(runeDepth, MULTICHAIN_DECIMAL)
      const assetAmount = Amount.fromBaseAmount(assetDepth, MULTICHAIN_DECIMAL)

      return new Pool(assetObj, runeAmount, assetAmount, detail)
    }

    return null
  }

  constructor(
    asset: Asset,
    runeDepth: Amount,
    assetDepth: Amount,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    detail: any,
  ) {
    this.asset = asset
    this.runeDepth = runeDepth
    this.assetDepth = assetDepth
    this.detail = detail
  }

  get assetPriceInRune(): Amount {
    return this.assetDepth.div(this.runeDepth)
  }

  get runePriceInAsset(): Amount {
    return this.runeDepth.div(this.assetDepth)
  }

  involvesAsset(asset: Asset): boolean {
    return asset.isRUNE() || this.asset.eq(asset)
  }

  priceOf(asset: Asset): Amount {
    invariant(this.involvesAsset(asset), 'Invalid asset')

    if (asset.isRUNE()) return this.runePriceInAsset
    return this.assetPriceInRune
  }

  depthOf(asset: Asset): Amount {
    invariant(this.involvesAsset(asset), 'Invalid asset')

    if (asset.isRUNE()) return this.runeDepth
    return this.assetDepth
  }
}
