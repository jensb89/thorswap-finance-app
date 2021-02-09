import { Amount } from './amount'
import { Asset } from './asset'
import { Percent } from './percent'

export class Memo {
  /**
   * Cannot be constructed.
   */
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {}

  public static swapMemo(asset: Asset, address = '', limit?: Amount) {
    const { chain } = asset
    const { symbol } = asset
    const limitString = limit?.baseAmount.toString() ?? ''

    return `SWAP:${chain}.${symbol}:${address}:${limitString}`
  }

  public static depositMemo(asset: Asset, address = '') {
    const { chain } = asset
    const { symbol } = asset

    return `STAKE:${chain}.${symbol}:${address}`
  }

  public static withdrawMemo(asset: Asset, percent: Percent) {
    const { chain } = asset
    const { symbol } = asset

    // multiply percent by 100
    return `WITHDRAW:${chain}.${symbol}:${percent.mul(100).toFixed(0)}`
  }
}
