import { StatsData, Network, Constants, Queue } from 'midgard-sdk'
import { Pool } from 'multichain-sdk'

export interface State {
  pools: Pool[]
  poolLoading: boolean
  stats: StatsData | null
  networkData: Network | null
  constants: Constants | null
  queue: Queue | null
}
