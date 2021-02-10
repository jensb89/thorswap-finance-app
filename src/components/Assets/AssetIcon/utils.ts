import { bnbIcon } from 'components/Icons'
import { Asset } from 'multichain-sdk'
import { assetIconMap } from 'settings/logoData'

export const getAssetIconUrl = (asset: Asset): string => {
  if (asset.isBNB()) {
    return bnbIcon
  }

  const logoSymbol = assetIconMap[asset.ticker]

  if (logoSymbol) {
    return `https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/binance/assets/${logoSymbol}/logo.png`
  }

  return `https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/binance/assets/${asset.symbol}/logo.png`
}
