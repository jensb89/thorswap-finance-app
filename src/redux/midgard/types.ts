import { Pool } from 'multichain-sdk'

export interface State {
  pools: Pool[]
  poolLoading: boolean
}
