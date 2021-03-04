import { Pool, Asset } from 'multichain-sdk'

export const HOME_ROUTE = '/'
export const CONNECT_WALLET_ROUTE = '/wallet/connect'
export const CREATE_WALLET_ROUTE = '/wallet/create'

export const TOOLS_ROUTE = '/tools'
export const EXPLORERS_ROUTE = '/explorer'
export const EDUCATION_ROUTE = '/education'
export const STATS_ROUTE = '/stats'
export const FAQS_ROUTE = '/faq'

export const TX_ROUTE = '/tx'

export const POOL_DETAIL_ROUTE = '/pool'

export const getPoolDetailRoute = (pool: Pool) => {
  return `${POOL_DETAIL_ROUTE}/${pool.asset.toString()}`
}

export const SEND_ROUTE = '/send'

export const getSendRoute = (asset: Asset) => {
  return `${SEND_ROUTE}/${asset.toString()}`
}

export const SWAP_ROUTE = '/swap'

export const getSwapRoute = (input: Asset, output: Asset) => {
  return `${SWAP_ROUTE}/${input.toString()}_${output.toString()}`
}

export const LIQUIDITY_ROUTE = '/liquidity'

export const getLiquidityRoute = (asset: Asset) => {
  return `${LIQUIDITY_ROUTE}/${asset.toString()}`
}
