import invariant from 'tiny-invariant'

import { DEFAULT_SLIP_LIMIT, MULTICHAIN_DECIMAL } from '../constants'
import { AmountType, Amount } from './amount'
import { Asset } from './asset'
import { AssetAmount } from './assetAmount'
import { Percent } from './percent'
import { Pool } from './pool'
import { Price } from './price'

export enum SwapType {
  SINGLE_SWAP,
  DOUBLE_SWAP,
}

export enum QuoteType {
  EXACT_IN,
  EXACT_OUT,
}

export interface ISwap {
  readonly swapType: SwapType
  readonly quoteType: QuoteType

  readonly inputAsset: Asset
  readonly outputAsset: Asset
  readonly price: Price // input asset price based in output asset

  // swapPools[0]: first swap pool, swapPools[1]: second swap pool(for Double Swap Only)
  readonly swapPools: Pool[]

  readonly inputAmount: AssetAmount
  readonly outputAmount: AssetAmount
  readonly outputAmountAfterFee: AssetAmount
  readonly fee: AssetAmount
  readonly outputPercent: Percent
  readonly feePercent: Percent
  readonly slip: Percent

  readonly hasInSufficientFee: boolean
  readonly estimatedNetworkFee: AssetAmount

  minOutputAmount: Amount

  setSlipLimitPercent(limit: number): void
  getSlipLimitPercent(): number

  getOutputAmount(inputAmount: AssetAmount): AssetAmount
  getOutputAfterNetworkFee(inputAmount: AssetAmount): AssetAmount
  getOutputPercent(inputAmount: AssetAmount): Percent
  getFeePercent(inputAmount: AssetAmount): Percent
  getInputAmount(outputAmount: AssetAmount): AssetAmount
  getSlip(inputAmount: AssetAmount): Percent
  getFee(inputAmount: AssetAmount): AssetAmount
}

export class Swap implements ISwap {
  private slipLimitPercent: number = DEFAULT_SLIP_LIMIT

  public readonly swapType: SwapType

  public readonly inputAsset: Asset

  public readonly outputAsset: Asset

  public readonly price: Price // input asset price based in output asset

  // swapPools[0]: first swap pool, swapPools[1]: second swap pool(for Double Swap Only)
  public readonly swapPools: Pool[] = []

  public readonly quoteType: QuoteType

  public readonly inputAmount: AssetAmount

  public readonly outputAmount: AssetAmount

  public readonly outputAmountAfterFee: AssetAmount

  public readonly fee: AssetAmount

  public readonly outputPercent: Percent

  public readonly feePercent: Percent

  public readonly slip: Percent

  public readonly estimatedNetworkFee: AssetAmount

  public readonly hasInSufficientFee: boolean = false

  private _0_AMOUNT: Amount

  constructor(
    inputAsset: Asset,
    outputAsset: Asset,
    pools: Pool[],
    amount: AssetAmount,
  ) {
    this.inputAsset = inputAsset
    this.outputAsset = outputAsset

    // input asset price based in output asset
    this.price = new Price({
      baseAsset: this.outputAsset,
      quoteAsset: this.inputAsset,
      pools,
    })

    this._0_AMOUNT = Amount.fromAssetAmount(0, inputAsset.decimal)

    invariant(
      !this.inputAsset.isRUNE() || !this.outputAsset.isRUNE(),
      'Invalid pair',
    )

    invariant(amount.gte(this._0_AMOUNT), 'Invalid Negative Amount')

    // set swap type and pools
    if (!this.inputAsset.isRUNE() && !this.outputAsset.isRUNE()) {
      this.swapType = SwapType.DOUBLE_SWAP

      const firstSwapPool = Pool.byAsset(this.inputAsset, pools)
      const secondSwapPool = Pool.byAsset(this.outputAsset, pools)

      invariant(firstSwapPool && secondSwapPool, 'Invalid Pool')
      if (firstSwapPool && secondSwapPool) {
        this.swapPools = [firstSwapPool, secondSwapPool]
      }
    } else {
      this.swapType = SwapType.SINGLE_SWAP

      if (!this.inputAsset.isRUNE()) {
        const firstSwapPool = Pool.byAsset(this.inputAsset, pools)
        invariant(firstSwapPool, 'Invalid Pool')
        if (firstSwapPool) {
          this.swapPools = [firstSwapPool]
        }
      }

      if (!this.outputAsset.isRUNE()) {
        const firstSwapPool = Pool.byAsset(this.outputAsset, pools)
        invariant(firstSwapPool, 'Invalid Pool')
        if (firstSwapPool) {
          this.swapPools = [firstSwapPool]
        }
      }
    }

    // get estimated network fee
    const lastPool =
      this.swapType === SwapType.SINGLE_SWAP
        ? this.swapPools[0]
        : this.swapPools[1]
    this.estimatedNetworkFee = this.getNetworkFee(
      lastPool,
      this.outputAsset.isRUNE(),
    )

    // set input, output, slip, fee, percent
    if (amount.asset === this.inputAsset) {
      this.quoteType = QuoteType.EXACT_IN
      this.inputAmount = amount
      this.outputAmount = this.getOutputAmount(amount)
      this.outputAmountAfterFee = this.getOutputAfterNetworkFee(amount)

      // validate
      if (this.outputAmountAfterFee.lt(this._0_AMOUNT)) {
        this.hasInSufficientFee = true
        this.outputAmount = new AssetAmount(this.outputAsset, this._0_AMOUNT)
      }
    } else {
      this.quoteType = QuoteType.EXACT_OUT
      this.outputAmountAfterFee = amount
      this.outputAmount = amount.add(this.estimatedNetworkFee)
      this.inputAmount = this.getInputAmount(amount)

      // validate
      if (this.inputAmount.lt(this._0_AMOUNT)) {
        this.hasInSufficientFee = true
        this.inputAmount = new AssetAmount(this.inputAsset, this._0_AMOUNT)
      }
    }

    this.fee = this.getFee(this.inputAmount)
    this.outputPercent = this.getOutputPercent(this.inputAmount)
    this.feePercent = this.getFeePercent(this.inputAmount)
    this.slip = this.getSlip(this.inputAmount)
  }

  setSlipLimitPercent(limit: number): void {
    this.slipLimitPercent = limit
  }

  getSlipLimitPercent(): number {
    return this.slipLimitPercent
  }

  public get minOutputAmount(): Amount {
    return this.outputAmount.mul(100 - this.slipLimitPercent).div(100).amount
  }

  public static getSingleSwapOutput(
    inputAmount: AssetAmount,
    pool: Pool,
  ): AssetAmount {
    // formula: (x * X * Y) / (x + X) ^ 2
    const toRUNE = !inputAmount.asset.isRUNE()
    const outputAsset = toRUNE ? Asset.RUNE() : pool.asset

    const x = inputAmount.amount
    const X = toRUNE ? pool.assetDepth : pool.runeDepth
    const Y = toRUNE ? pool.runeDepth : pool.assetDepth
    const numerator = x.mul(X).mul(Y)
    const denominator = new Amount(
      x.add(X).assetAmount.pow(2),
      AmountType.ASSET_AMOUNT,
      MULTICHAIN_DECIMAL,
    )

    return new AssetAmount(outputAsset, numerator.div(denominator))
  }

  getOutputAmount(inputAmount: AssetAmount): AssetAmount {
    invariant(inputAmount.asset === this.inputAsset, 'Invalid Asset')

    if (this.swapType === SwapType.SINGLE_SWAP) {
      return Swap.getSingleSwapOutput(inputAmount, this.swapPools[0])
    }

    invariant(!inputAmount.asset.isRUNE(), 'Invalid Asset')

    // double swap formula: getSwapOutput(getSwapOutput(x, X), Y)
    const firstSwapOutput = Swap.getSingleSwapOutput(
      inputAmount,
      this.swapPools[0],
    )

    return Swap.getSingleSwapOutput(firstSwapOutput, this.swapPools[1])
  }

  private getSingleSwapOutputAfterNetworkFee(
    inputAmount: AssetAmount,
    pool: Pool,
  ): AssetAmount {
    // formula: getSwapOutput() - network fee (1 RUNE)
    const toRUNE = !inputAmount.asset.isRUNE()
    const swapOutputAmount = Swap.getSingleSwapOutput(inputAmount, pool)
    const runeDepthAfterSwap = toRUNE
      ? pool.runeDepth.sub(swapOutputAmount)
      : pool.runeDepth.add(inputAmount)
    const assetDepthAfterSwap = toRUNE
      ? pool.assetDepth.add(inputAmount)
      : pool.assetDepth.sub(swapOutputAmount)
    const poolAfterSwap = new Pool(
      pool.asset,
      runeDepthAfterSwap,
      assetDepthAfterSwap,
      pool.detail,
    )

    const networkFee = this.getNetworkFee(poolAfterSwap, toRUNE)
    const outputAsset = toRUNE ? Asset.RUNE() : pool.asset

    return new AssetAmount(
      this.outputAsset,
      swapOutputAmount.sub(new AssetAmount(outputAsset, networkFee)),
    )
  }

  private getNetworkFee(pool: Pool, toRUNE: boolean): AssetAmount {
    // network fee is 1 RUNE
    const networkFeeInRune = Amount.fromAssetAmount(1, MULTICHAIN_DECIMAL)

    const feeAmount: Amount = toRUNE
      ? networkFeeInRune
      : networkFeeInRune.mul(pool.priceOf(Asset.RUNE()))

    return new AssetAmount(this.outputAsset, feeAmount)
  }

  getOutputAfterNetworkFee(inputAmount: AssetAmount): AssetAmount {
    invariant(inputAmount.asset === this.inputAsset, 'Invalid Asset')

    if (this.swapType === SwapType.SINGLE_SWAP) {
      return this.getSingleSwapOutputAfterNetworkFee(
        inputAmount,
        this.swapPools[0],
      )
    }

    invariant(!inputAmount.asset.isRUNE(), 'Invalid Asset')

    // double swap formula: getDoubleSwapOutput - 1 RUNE
    const toRUNE = !inputAmount.asset.isRUNE()
    const doubleSwapOutput = this.getOutputAmount(inputAmount)
    const pool = this.swapPools[1]

    const runeDepthAfterSwap = toRUNE
      ? pool.runeDepth.sub(doubleSwapOutput)
      : pool.runeDepth.add(inputAmount)
    const assetDepthAfterSwap = toRUNE
      ? pool.assetDepth.add(inputAmount)
      : pool.assetDepth.sub(doubleSwapOutput)
    const poolAfterSwap = new Pool(
      pool.asset,
      runeDepthAfterSwap,
      assetDepthAfterSwap,
      pool.detail,
    )

    const networkFee = this.getNetworkFee(
      poolAfterSwap,
      this.outputAsset.isRUNE(),
    )

    return new AssetAmount(
      this.outputAsset,
      doubleSwapOutput.sub(new AssetAmount(this.outputAsset, networkFee)),
    )
  }

  // output / input
  getOutputPercent(inputAmount: AssetAmount): Percent {
    const outputAmount = this.getOutputAfterNetworkFee(inputAmount)
    const inputAmountInOutputAsset = inputAmount.totalPriceIn(
      this.outputAsset,
      this.swapPools,
    ).amount

    return new Percent(outputAmount.div(inputAmountInOutputAsset).assetAmount)
  }

  // 1 - output / input
  getFeePercent(inputAmount: AssetAmount): Percent {
    const outputPercent = this.getOutputPercent(inputAmount)
    return new Percent(
      Amount.fromAssetAmount(1, outputPercent.decimal).sub(
        outputPercent,
      ).assetAmount,
    )
  }

  public static getSingleSwapInput(
    outputAmount: AssetAmount,
    pool: Pool,
  ): AssetAmount {
    // formula: (((X*Y)/y - 2*X) - sqrt(((X*Y)/y - 2*X)^2 - 4*X^2))/2
    // (part1 - sqrt(part1 - part2))/2
    const toRUNE = outputAmount.asset.isRUNE()
    const y = outputAmount.amount
    const X = toRUNE ? pool.assetDepth : pool.runeDepth
    const Y = toRUNE ? pool.runeDepth : pool.assetDepth
    const part1: Amount = X.mul(Y).div(y).sub(X.mul(2))
    const part2: Amount = new Amount(
      X.assetAmount.pow(2).multipliedBy(4),
      AmountType.ASSET_AMOUNT,
      MULTICHAIN_DECIMAL,
    )

    const inputAmount = new Amount(
      part1.assetAmount
        .minus(part1.assetAmount.pow(2).minus(part2.assetAmount).sqrt())
        .div(2),
      AmountType.ASSET_AMOUNT,
      MULTICHAIN_DECIMAL,
    )
    const inputAsset = !toRUNE ? Asset.RUNE() : pool.asset

    return new AssetAmount(inputAsset, inputAmount)
  }

  getInputAmount(outputAmount: AssetAmount): AssetAmount {
    invariant(outputAmount.asset === this.outputAsset, 'Invalid Asset')

    if (this.swapType === SwapType.SINGLE_SWAP) {
      return Swap.getSingleSwapInput(outputAmount, this.swapPools[0])
    }

    invariant(!outputAmount.asset.isRUNE(), 'Invalid Asset')

    // double swap formula: getSwapInput(getSwapInput(y, Y), X)
    const secondSwapInput = Swap.getSingleSwapInput(
      outputAmount,
      this.swapPools[1],
    )

    return Swap.getSingleSwapInput(secondSwapInput, this.swapPools[0])
  }

  public static getSingleSwapSlip(
    inputAmount: AssetAmount,
    pool: Pool,
  ): Percent {
    // formula: (x) / (x + X)
    const x = inputAmount.amount
    const X = pool.depthOf(inputAmount.asset)

    return new Percent(x.div(x.add(X)).assetAmount)
  }

  getSlip(inputAmount: AssetAmount): Percent {
    invariant(inputAmount.asset === this.inputAsset, 'Invalid Asset')

    if (this.swapType === SwapType.SINGLE_SWAP) {
      return Swap.getSingleSwapSlip(inputAmount, this.swapPools[0])
    }

    invariant(!inputAmount.asset.isRUNE(), 'Invalid Asset')

    // double swap slip formula: getSingleSwapSlip(input1) + getSingleSwapSlip(getSwapOutput1 => input2)
    const firstSlip = Swap.getSingleSwapSlip(inputAmount, this.swapPools[0])
    const firstSwapOutput = Swap.getSingleSwapOutput(
      inputAmount,
      this.swapPools[0],
    )
    const secondSlip = Swap.getSingleSwapSlip(
      firstSwapOutput,
      this.swapPools[1],
    )

    return new Percent(firstSlip.add(secondSlip).assetAmount)
  }

  // fee amount is based in output asset
  public static getSingleSwapFee(
    inputAmount: AssetAmount,
    pool: Pool,
  ): AssetAmount {
    // formula: (x * x * Y) / (x + X) ^ 2
    const toRUNE = !inputAmount.asset.isRUNE()
    const outputAsset = toRUNE ? Asset.RUNE() : pool.asset

    const x = inputAmount.amount
    const X = toRUNE ? pool.assetDepth : pool.runeDepth
    const Y = toRUNE ? pool.runeDepth : pool.assetDepth
    const numerator = x.mul(X).mul(Y)
    const denominator = new Amount(
      x.add(X).assetAmount.pow(2),
      AmountType.ASSET_AMOUNT,
      MULTICHAIN_DECIMAL,
    )

    return new AssetAmount(outputAsset, numerator.div(denominator))
  }

  // fee amount is based in output asset
  getFee(inputAmount: AssetAmount): AssetAmount {
    invariant(inputAmount.asset === this.inputAsset, 'Invalid Asset')

    if (this.swapType === SwapType.SINGLE_SWAP) {
      return Swap.getSingleSwapFee(inputAmount, this.swapPools[0])
    }

    invariant(!inputAmount.asset.isRUNE(), 'Invalid Asset')

    // double swap fee: getSwapFee1 + getSwapFee2
    const firstSwapOutput = Swap.getSingleSwapOutput(
      inputAmount,
      this.swapPools[0],
    )
    // first swap fee is always based in rune
    const firstSwapFeeInRune = Swap.getSingleSwapFee(
      inputAmount,
      this.swapPools[0],
    )

    // second swap fee based in output asset
    const secondSwapFeeInAsset = Swap.getSingleSwapFee(
      firstSwapOutput,
      this.swapPools[1],
    )

    // first swap fee based in output asset
    const firstSwapFeeInAsset = new AssetAmount(
      Asset.RUNE(),
      firstSwapFeeInRune,
    ).totalPriceIn(this.outputAsset, this.swapPools)

    return new AssetAmount(
      this.outputAsset,
      firstSwapFeeInAsset.add(secondSwapFeeInAsset),
    )
  }
}
