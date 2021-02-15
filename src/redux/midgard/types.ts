import { PoolDetail } from 'midgard-sdk'

export interface State {
  pools: PoolDetail[]
  poolLoading: boolean
}
