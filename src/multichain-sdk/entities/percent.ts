import BigNumber from 'bignumber.js'

import { Rounding, Amount, EMPTY_FORMAT, NUMBER_FORMAT } from './amount'

export class Percent extends Amount {
  toSignificant(
    significantDigits = 8,
    format: BigNumber.Format = EMPTY_FORMAT,
    rounding: Rounding = Rounding.ROUND_DOWN,
  ): string {
    return this.mul(100).toSignificant(significantDigits, format, rounding)
  }

  toFixed(
    decimalPlaces = 8,
    format: BigNumber.Format = NUMBER_FORMAT,
    rounding: Rounding = Rounding.ROUND_DOWN,
  ): string {
    return this.mul(100).toFixed(decimalPlaces, format, rounding)
  }
}
