import { Amount } from './amount'
import { Asset } from './asset'
import { AssetAmount } from './assetAmount'
import { Percent } from './percent'
import { Pool } from './pool'

export type WithdrawAmount = {
  runeAmount: AssetAmount;
  assetAmount: AssetAmount;
};

export interface ILiquidity {
  readonly pool: Pool;
  readonly poolUnits: Amount;
  readonly liquidityUnits: Amount;

  assetShare: AssetAmount;
  runeShare: AssetAmount;

  getLiquidityUnits(
    runeAddAmount: AssetAmount,
    assetAddAmount: AssetAmount,
  ): Amount;
  getLiquiditySlip(
    runeAddAmount: AssetAmount,
    assetAddAmount: AssetAmount,
  ): Percent;
  getWithdrawAmount(percent: Percent): WithdrawAmount;
}

export class Liquidity implements ILiquidity {
  public readonly pool: Pool;

  public readonly poolUnits: Amount;

  public readonly liquidityUnits: Amount;

  constructor(pool: Pool, liquidityUnits: Amount) {
    this.pool = pool
    this.poolUnits = Amount.fromBaseAmount(pool.detail.units, pool.decimal)
    this.liquidityUnits = liquidityUnits
  }

  public get assetShare(): AssetAmount {
    // formula: Total Balance * liquidity Units / total Units
    return new AssetAmount(
      this.pool.asset,
      this.pool.assetDepth.mul(this.liquidityUnits).div(this.poolUnits),
    )
  }

  public get runeShare(): AssetAmount {
    // formula: Total Balance * liquidity Units / total Units
    return new AssetAmount(
      Asset.RUNE(),
      this.pool.runeDepth.mul(this.liquidityUnits).div(this.poolUnits),
    )
  }

  /**
   * get liquidity units after liquidity is added to the pool
   *
   * @param runeAddAmount rune amount to add
   * @param assetAddAmount asset amount to add
   */
  getLiquidityUnits(
    runeAddAmount: AssetAmount,
    assetAddAmount: AssetAmount,
  ): Amount {
    // formula: ((R + T) (r T + R t))/(4 R T)
    const R = this.pool.runeDepth.add(runeAddAmount) // Must add r first
    const T = this.pool.assetDepth.add(assetAddAmount) // Must add t first
    const part1 = R.add(T)
    const part2 = runeAddAmount.mul(T).amount
    const part3 = R.mul(assetAddAmount)
    const numerator = part1.mul(part2.add(part3))
    const denominator = R.mul(T).mul(4)

    return numerator.div(denominator)
  }

  /**
   * get slip for add liquidity
   *
   * @param runeAddAmount rune amount to add
   * @param assetAddAmount asset amount to add
   */
  getLiquiditySlip(
    runeAddAmount: AssetAmount,
    assetAddAmount: AssetAmount,
  ): Percent {
    // formula: (t * R - T * r)/ (T*r + R*T)
    const R = this.pool.runeDepth
    const T = this.pool.assetDepth
    const numerator = assetAddAmount.amount
      .mul(R)
      .sub(T.mul(runeAddAmount.amount))
    const denominator = T.mul(runeAddAmount).add(R.mul(T))

    return numerator.div(denominator)
  }

  getWithdrawAmount(percent: Percent): WithdrawAmount {
    const runeAmount = this.runeShare.mul(percent)
    const assetAmount = this.assetShare.mul(percent)

    return {
      runeAmount,
      assetAmount,
    }
  }
}
