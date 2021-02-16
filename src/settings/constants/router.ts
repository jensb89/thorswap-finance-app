import { Asset } from 'multichain-sdk'

export const HOME_ROUTE = '/'
export const CONNECT_WALLET_ROUTE = '/wallet/connect'
export const CREATE_WALLET_ROUTE = '/wallet/create'

export const SEND_ROUTE = '/swap'

export const getSendRoute = (asset: Asset) => {
  return `${SEND_ROUTE}/${asset.toString()}`
}

export const SWAP_ROUTE = '/swap'

export const getSwapRoute = (asset1: Asset, asset2: Asset) => {
  return `${SWAP_ROUTE}/${asset1.toString()}_${asset2.toString()}`
}
