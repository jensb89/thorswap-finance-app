import { Asset } from 'multichain-sdk'

import { bnbIcon, nativeRuneIcon } from 'components/Icons'

import { assetIconMap } from 'settings/logoData'

export const getAssetIconUrl = (asset: Asset): string => {
  if (asset.isBNB()) {
    return bnbIcon
  }
  if (asset.isRUNE()) {
    return nativeRuneIcon
  }

  // ethereum logos
  if (asset.ticker === 'WETH') {
    return 'https://assets.coingecko.com/coins/images/2518/large/weth.png'
  }

  if (asset.ticker === 'DAI') {
    return 'https://raw.githubusercontent.com/compound-finance/token-list/master/assets/asset_DAI.svg'
  }

  const logoSymbol = assetIconMap[asset.ticker]

  if (logoSymbol) {
    return `https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/binance/assets/${logoSymbol}/logo.png`
  }

  return `https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/binance/assets/${asset.symbol}/logo.png`
}
