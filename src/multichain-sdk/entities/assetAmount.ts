import BigNumber from 'bignumber.js'
import invariant from 'tiny-invariant'

import { AmountType, Rounding, Amount, IAmount } from './amount'
import { Asset } from './asset'
import { Pool } from './pool'
import { Price } from './price'

// TODO: compare method between asset amount

export interface IAssetAmount extends IAmount {
  readonly asset: Asset;
  readonly amount: Amount;

  add(amount: AssetAmount): AssetAmount;
  sub(amount: AssetAmount): AssetAmount;
  mul(value: BigNumber.Value | Amount): AssetAmount;
  div(value: BigNumber.Value | Amount): AssetAmount;

  toCurrencyFormat(
    {
      significantDigits,
      format,
      rounding,
    }: {
      significantDigits?: number;
      format?: BigNumber.Format;
      rounding?: Rounding;
    },
    isPrefix?: boolean,
  ): string;
  unitPriceIn(asset: Asset, pools: Pool[]): Price;
  totalPriceIn(asset: Asset, pools: Pool[]): Price;
}

export class AssetAmount extends Amount implements IAssetAmount {
  public readonly asset: Asset;

  public readonly amount: Amount;

  constructor(asset: Asset, amount: Amount) {
    super(amount.baseAmount, AmountType.BASE_AMOUNT, asset.decimal)
    this.asset = asset
    this.amount = amount
  }

  add(amount: AssetAmount): AssetAmount {
    invariant(this.asset.eq(amount.asset), 'asset must be same')

    return new AssetAmount(this.asset, this.amount.add(amount.amount))
  }

  sub(amount: AssetAmount): AssetAmount {
    invariant(this.asset.eq(amount.asset), 'asset must be same')

    return new AssetAmount(this.asset, this.amount.sub(amount.amount))
  }

  mul(value: BigNumber.Value | Amount): AssetAmount {
    let amount
    if (value instanceof Amount) {
      amount = new Amount(
        this.assetAmount.multipliedBy(value.assetAmount),
        AmountType.ASSET_AMOUNT,
        this.decimal,
      )
    } else {
      amount = new Amount(
        this.assetAmount.multipliedBy(value),
        AmountType.ASSET_AMOUNT,
        this.decimal,
      )
    }

    return new AssetAmount(this.asset, amount)
  }

  div(value: BigNumber.Value | Amount): AssetAmount {
    let amount
    if (value instanceof Amount) {
      amount = new Amount(
        this.assetAmount.dividedBy(value.assetAmount),
        AmountType.ASSET_AMOUNT,
        this.decimal,
      )
    } else {
      amount = new Amount(
        this.assetAmount.dividedBy(value),
        AmountType.ASSET_AMOUNT,
        this.decimal,
      )
    }

    return new AssetAmount(this.asset, amount)
  }

  toCurrencyFormat(
    {
      significantDigits,
      format,
      rounding,
    }: {
      significantDigits?: number;
      format?: BigNumber.Format;
      rounding?: Rounding;
    },
    isPrefix = true,
  ): string {
    const significantValue = super.toSignificant(
      significantDigits,
      format,
      rounding,
    )

    if (isPrefix) {
      return `${this.asset.currencySymbol} ${significantValue}`
    }

    return `${significantValue} ${this.asset.currencySymbol}`
  }

  unitPriceIn(quoteAsset: Asset, pools: Pool[]): Price {
    return new Price(this.asset, quoteAsset, pools)
  }

  totalPriceIn(quoteAsset: Asset, pools: Pool[]): Price {
    return new Price(
      this.asset,
      quoteAsset,
      pools,
      Amount.fromAssetAmount(this.assetAmount, this.decimal),
    )
  }
}
