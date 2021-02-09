import BigNumber from 'bignumber.js'

import { Rounding, Amount } from './amount'

export class Percent extends Amount {
  toSignificant(
    significantDigits = 8,
    format: BigNumber.Format = { groupSeparator: '' },
    rounding: Rounding = Rounding.ROUND_DOWN,
  ): string {
    return this.mul(100).toSignificant(significantDigits, format, rounding)
  }

  toFixed(
    decimalPlaces = 8,
    format: BigNumber.Format = { groupSeparator: '' },
    rounding: Rounding = Rounding.ROUND_DOWN,
  ): string {
    return this.mul(100).toFixed(decimalPlaces, format, rounding)
  }
}
