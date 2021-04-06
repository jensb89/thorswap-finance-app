import { Chain, THORChain, BNBChain, ETHChain } from '@xchainjs/xchain-util'

import { Amount, Asset, Pool, Price } from '../entities'

/**
 * return a ticker of asset that represents the network fee
 * @param chain
 */
export const chainToFeeAsset = (chain: Chain): string => {
  if (chain === THORChain) return 'RUNE'

  return chain
}

/**
 *
 * @param runeAmount rune amount
 * @param quoteAsset quote asset - selected base currency
 * @param pools pools
 */
export const runeToAsset = ({
  runeAmount,
  quoteAsset,
  pools,
}: {
  runeAmount: Amount
  quoteAsset?: Asset | null
  pools: Pool[]
}): Price => {
  const price = new Price({
    baseAsset: Asset.RUNE(),
    quoteAsset: quoteAsset || Asset.RUNE(),
    pools,
    priceAmount: runeAmount,
  })

  return price
}

export const isOldRune = (asset: Asset): boolean => {
  if (
    asset.ticker === 'RUNE' &&
    (asset.chain === BNBChain || asset.chain === ETHChain)
  ) {
    return true
  }

  return false
}
