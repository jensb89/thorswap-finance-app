import { ActionType } from 'midgard-sdk'

export type TxFilterType = {
  offset?: number
  limit?: number
  address?: string
  txId?: string
  asset?: string
  type?: ActionType | 'all' | ''
}
