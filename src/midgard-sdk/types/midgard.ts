import { InlineResponse200 as ActionsList } from '../api'

export * from '../api'

export type { ActionsList }

export type NetworkType = 'testnet' | 'chaosnet' | 'mainnet'

export type PoolStatus = 'available' | 'staged' | 'suspended'

export type StatsPeriod = '1h' | '24h' | '7d' | '30d' | '90d' | '365d' | 'all'

export type HistoryInterval =
  | '5min'
  | 'hour'
  | 'day'
  | 'week'
  | 'month'
  | 'quarter'
  | 'year'

export type HistoryQuery = {
  interval?: HistoryInterval
  count?: number
  to?: number
  from?: number
}

export type ActionType =
  | 'swap'
  | 'addLiquidity'
  | 'withdraw'
  | 'donate'
  | 'refund'

export type ActionListParams = {
  address?: string
  txId?: string
  asset?: string
  type?: ActionType
  limit: number
  offset: number
}

export type PoolAddress = string
