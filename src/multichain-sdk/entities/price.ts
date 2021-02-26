import BigNumber from 'bignumber.js'
import invariant from 'tiny-invariant'

import { AmountType, Amount, IAmount, Rounding, NUMBER_FORMAT } from './amount'
import { Asset } from './asset'
import { Pool } from './pool'

export interface IPrice extends IAmount {
  readonly baseAsset: Asset
  readonly quoteAsset: Asset
  readonly unitPrice: BigNumber
  readonly price: BigNumber
  readonly amount: Amount

  raw(): BigNumber
  invert(): BigNumber
}

export class Price extends Amount {
  public readonly baseAsset: Asset

  public readonly quoteAsset?: Asset

  public readonly unitPrice: BigNumber

  public readonly price: BigNumber

  public readonly amount: Amount

  constructor({
    baseAsset,
    quoteAsset,
    pools,
    priceAmount,
  }: {
    baseAsset: Asset
    quoteAsset?: Asset
    pools: Pool[]
    priceAmount?: Amount
  }) {
    const amount = priceAmount
      ? Amount.fromAssetAmount(priceAmount.assetAmount, baseAsset.decimal)
      : Amount.fromAssetAmount(1, baseAsset.decimal)

    super(amount.assetAmount, AmountType.ASSET_AMOUNT, baseAsset.decimal)

    this.amount = amount
    this.baseAsset = baseAsset
    this.quoteAsset = quoteAsset

    // initialize with 0
    let unitPrice: BigNumber = new BigNumber(0)
    let price: BigNumber = new BigNumber(0)

    // if quoteAsset is not specified OR is USD, calc the price for USD
    if (!quoteAsset || quoteAsset.eq(Asset.USD())) {
      // set USD price for non-RUNE asset
      if (!baseAsset.isRUNE()) {
        const pool = Pool.byAsset(baseAsset, pools)
        invariant(pool, `${baseAsset.toString()} Pool does not exist`)

        if (pool) {
          unitPrice = pool.assetUSDPrice.assetAmount
        }
      } else {
        // set USD Price of RUNE
        const pool = pools?.[0]

        if (pool) {
          unitPrice = pool.runePriceInAsset.mul(pool.assetUSDPrice).assetAmount
        }
      }
    } else if (baseAsset.isRUNE() && !quoteAsset.isRUNE()) {
      const pool = Pool.byAsset(quoteAsset, pools)

      invariant(pool, `${quoteAsset.toString()} Pool does not exist`)

      if (pool) {
        unitPrice = pool.runePriceInAsset.assetAmount
      }
    } else if (!baseAsset.isRUNE() && quoteAsset.isRUNE()) {
      const pool = Pool.byAsset(baseAsset, pools)

      invariant(pool, `${baseAsset.toString()} Pool does not exist`)

      if (pool) {
        unitPrice = pool.assetPriceInRune.assetAmount
      }
    } else if (!baseAsset.isRUNE() && !quoteAsset.isRUNE()) {
      const baseAssetPool = Pool.byAsset(baseAsset, pools)
      const quoteAssetPool = Pool.byAsset(quoteAsset, pools)

      invariant(baseAssetPool && quoteAssetPool, 'Pool does not exist')

      if (baseAssetPool && quoteAssetPool) {
        unitPrice = baseAssetPool.assetPriceInRune.div(
          quoteAssetPool.assetPriceInRune,
        ).assetAmount
      }
    } else {
      // both are RUNE
      unitPrice = new BigNumber(1)
    }

    price = unitPrice.multipliedBy(amount.assetAmount)
    this.price = price
    this.unitPrice = unitPrice
  }

  raw(): BigNumber {
    return this.price
  }

  invert(): BigNumber {
    return new BigNumber(1).dividedBy(this.raw())
  }

  toCurrencyFormat(
    decimalPlaces = 8,
    format: BigNumber.Format = NUMBER_FORMAT,
    rounding: Rounding = Rounding.ROUND_DOWN,
  ): string {
    const fixedLabel = this.toFixedRaw(decimalPlaces, format, rounding)

    const isUSDBased = !this.quoteAsset || this.quoteAsset.ticker === 'USD'

    return isUSDBased
      ? `$${fixedLabel}`
      : `${fixedLabel} ${this.quoteAsset?.ticker}`
  }

  toFixedRaw(
    decimalPlaces = 8,
    format: BigNumber.Format = NUMBER_FORMAT,
    rounding: Rounding = Rounding.ROUND_DOWN,
  ): string {
    return Amount.fromAssetAmount(this.price, 8).toFixed(
      decimalPlaces,
      format,
      rounding,
    )
  }

  toFixedInverted(
    decimalPlaces = 8,
    format: BigNumber.Format = NUMBER_FORMAT,
    rounding: Rounding = Rounding.ROUND_DOWN,
  ): string {
    return Amount.fromAssetAmount(this.invert(), 8).toFixed(
      decimalPlaces,
      format,
      rounding,
    )
  }
}
