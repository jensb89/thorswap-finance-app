import BigNumber from 'bignumber.js'
import invariant from 'tiny-invariant'

import { AmountType, Amount, IAmount } from './amount'
import { Asset } from './asset'
import { Pool } from './pool'

export interface IPrice extends IAmount {
  readonly baseAsset: Asset;
  readonly quoteAsset: Asset;
  readonly unitPrice: BigNumber;
  readonly price: BigNumber;
  readonly amount: Amount;

  raw(): BigNumber;
  invert(): BigNumber;
}

export class Price extends Amount {
  public readonly baseAsset: Asset;

  public readonly quoteAsset: Asset;

  public readonly unitPrice: BigNumber;

  public readonly price: BigNumber;

  public readonly amount: Amount;

  constructor(
    baseAsset: Asset,
    quoteAsset: Asset,
    pools: Pool[],
    priceAmount?: Amount,
  ) {
    const amount = priceAmount || Amount.fromAssetAmount(1, baseAsset.decimal)

    super(amount.assetAmount, AmountType.ASSET_AMOUNT, baseAsset.decimal)

    this.amount = amount
    this.baseAsset = baseAsset
    this.quoteAsset = quoteAsset

    // initialize with 0
    let unitPrice: BigNumber = new BigNumber(0)
    let price: BigNumber = new BigNumber(0)

    if (baseAsset.isRUNE() && !quoteAsset.isRUNE()) {
      const pool = Pool.byAsset(quoteAsset, pools)

      invariant(pool, 'Pool does not exist')

      if (pool) {
        unitPrice = pool.runePriceInAsset.assetAmount
        price = unitPrice.multipliedBy(amount.assetAmount)
      }
    } else if (!baseAsset.isRUNE() && quoteAsset.isRUNE()) {
      const pool = Pool.byAsset(quoteAsset, pools)

      invariant(pool, 'Pool does not exist')

      if (pool) {
        unitPrice = pool.assetPriceInRune.assetAmount
        price = unitPrice.multipliedBy(amount.assetAmount)
      }
    } else if (!baseAsset.isRUNE() && !quoteAsset.isRUNE()) {
      const baseAssetPool = Pool.byAsset(baseAsset, pools)
      const quoteAssetPool = Pool.byAsset(quoteAsset, pools)

      invariant(baseAssetPool && quoteAssetPool, 'Pool does not exist')

      if (baseAssetPool && quoteAssetPool) {
        unitPrice = baseAssetPool.assetPriceInRune.div(
          quoteAssetPool.assetPriceInRune,
        ).assetAmount
        price = unitPrice.multipliedBy(amount.assetAmount)
      }
    } else {
      // both are RUNE
      unitPrice = new BigNumber(1)
      price = unitPrice.multipliedBy(amount.assetAmount)
    }

    this.price = price
    this.unitPrice = unitPrice
  }

  raw(): BigNumber {
    return this.price
  }

  invert(): BigNumber {
    return new BigNumber(1).dividedBy(this.raw())
  }
}
