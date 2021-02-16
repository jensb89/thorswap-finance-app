import { Wallet, SupportedChain } from '../clients'
import { Asset, AssetAmount } from '../entities'

export const getWalletAssets = (wallet: Wallet | null) => {
  const assets: Asset[] = []

  if (!wallet) return assets

  Object.keys(wallet).map((chain) => {
    const chainWallet = wallet[chain as SupportedChain]

    chainWallet.balance.forEach((data: AssetAmount) => {
      assets.push(data.asset)
    })
  })

  return assets
}
