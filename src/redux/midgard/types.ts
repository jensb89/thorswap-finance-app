import {
  StatsData,
  Network,
  Constants,
  Queue,
  PoolStatsDetail,
  DepthHistory,
  EarningsHistory,
  SwapHistory,
  LiquidityHistory,
  ActionsList,
  MemberDetails,
  Action,
  ActionTypeEnum,
  Coin,
} from 'midgard-sdk'
import { Pool } from 'multichain-sdk'

export enum TxTrackerStatus {
  Submitting = 'Submitting',
  Pending = 'Pending',
  Success = 'Success',
}

export interface SubmitTx {
  inAssets: Coin[]
  outAssets: Coin[]
  txID?: string
}

export interface TxTracker {
  uuid: string
  type: ActionTypeEnum
  status: TxTrackerStatus
  submitTx: SubmitTx
  action: Action | null
  refunded: boolean | null
}

export interface State {
  pools: Pool[]
  poolLoading: boolean
  memberDetails: MemberDetails
  memberDetailsLoading: boolean
  poolStats: PoolStatsDetail | null
  poolStatsLoading: boolean
  depthHistory: DepthHistory | null
  depthHistoryLoading: boolean
  earningsHistory: EarningsHistory | null
  earningsHistoryLoading: boolean
  swapHistory: SwapHistory | null
  swapHistoryLoading: boolean
  liquidityHistory: LiquidityHistory | null
  liquidityHistoryLoading: boolean
  stats: StatsData | null
  networkData: Network | null
  constants: Constants | null
  queue: Queue | null
  txData: ActionsList | null // for tx explorer
  txDataLoading: boolean
  txTrackers: TxTracker[]
  txCollapsed: boolean
}
