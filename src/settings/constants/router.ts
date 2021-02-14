import { Asset } from 'multichain-sdk'

export const HOME_ROUTE = '/'
export const CONNECT_ROUTE = '/connect'
export const SWAP_ROUTE = '/swap'

export const getSwapRoute = (asset1: Asset, asset2: Asset) => {
  return `${SWAP_ROUTE}/${asset1.toString()}_${asset2.toString()}`
}
