import BigNumber from 'bignumber.js'
import { Amount } from 'multichain-sdk'

export const getAmountFromString = (
  value: string,
  decimal: number,
): Amount | null => {
  const trim = value.replace(/[, ]+/g, '').trim()

  if (trim !== '' && trim[trim.length - 1] === '.') return null

  const bn = new BigNumber(trim)

  if (bn.isNaN()) return Amount.fromAssetAmount(0, decimal)

  return Amount.fromAssetAmount(bn, decimal)
}
