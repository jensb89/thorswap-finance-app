import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { ActionStatusEnum, ActionTypeEnum } from 'midgard-sdk'
import { Pool } from 'multichain-sdk'

import * as midgardActions from './actions'
import { State, TxTracker, TxTrackerStatus } from './types'

const initialState: State = {
  pools: [],
  poolLoading: false,
  memberDetails: {
    pools: [],
  },
  memberDetailsLoading: false,
  stats: null,
  networkData: null,
  constants: null,
  queue: null,
  poolStats: null,
  poolStatsLoading: false,
  depthHistory: null,
  depthHistoryLoading: false,
  earningsHistory: null,
  earningsHistoryLoading: false,
  swapHistory: null,
  swapHistoryLoading: false,
  liquidityHistory: null,
  liquidityHistoryLoading: false,
  txData: null,
  txDataLoading: false,
  txTrackers: [],
  txCollapsed: true,
}

const slice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    addNewTxTracker(state, action: PayloadAction<TxTracker>) {
      state.txTrackers = [...state.txTrackers, action.payload]
      state.txCollapsed = false
    },
    updateTxTracker(
      state,
      action: PayloadAction<{ uuid: string; txTracker: Partial<TxTracker> }>,
    ) {
      const { uuid, txTracker } = action.payload

      state.txTrackers = state.txTrackers.map((tracker: TxTracker) => {
        if (tracker.uuid === uuid) {
          return {
            ...tracker,
            ...txTracker,
          }
        }

        return tracker
      })
    },
    clearTxTrackers(state) {
      state.txTrackers = []
    },
    setTxCollapsed(state, action: PayloadAction<boolean>) {
      state.txCollapsed = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(midgardActions.getPools.pending, (state) => {
        state.poolLoading = true
      })
      .addCase(midgardActions.getPools.fulfilled, (state, action) => {
        const pools = action.payload

        state.pools = pools.reduce((res: Pool[], poolDetail) => {
          const poolObj = Pool.fromPoolData(poolDetail)
          if (poolObj) {
            res.push(poolObj)
          }
          return res
        }, [])

        state.poolLoading = false
      })
      .addCase(midgardActions.getPools.rejected, (state) => {
        state.poolLoading = false
      })
      .addCase(midgardActions.getMemberDetail.pending, (state) => {
        state.memberDetailsLoading = true
      })
      .addCase(midgardActions.getMemberDetail.fulfilled, (state, action) => {
        state.memberDetails = action.payload
        state.memberDetailsLoading = false
      })
      .addCase(midgardActions.getMemberDetail.rejected, (state) => {
        state.memberDetailsLoading = false
      })
      .addCase(midgardActions.getStats.fulfilled, (state, action) => {
        state.stats = action.payload
      })
      .addCase(midgardActions.getNetworkData.fulfilled, (state, action) => {
        state.networkData = action.payload
      })
      .addCase(midgardActions.getConstants.fulfilled, (state, action) => {
        state.constants = action.payload
      })
      .addCase(midgardActions.getQueue.fulfilled, (state, action) => {
        state.queue = action.payload
      })
      // get pool stats
      .addCase(midgardActions.getPoolStats.pending, (state) => {
        state.poolStatsLoading = true
      })
      .addCase(midgardActions.getPoolStats.fulfilled, (state, action) => {
        state.poolStatsLoading = false
        state.poolStats = action.payload
      })
      .addCase(midgardActions.getPoolStats.rejected, (state) => {
        state.poolStatsLoading = true
      })
      // get depth history
      .addCase(midgardActions.getDepthHistory.pending, (state) => {
        state.depthHistoryLoading = true
      })
      .addCase(midgardActions.getDepthHistory.fulfilled, (state, action) => {
        state.depthHistoryLoading = false
        state.depthHistory = action.payload
      })
      .addCase(midgardActions.getDepthHistory.rejected, (state) => {
        state.depthHistoryLoading = true
      })
      // get earnings history
      .addCase(midgardActions.getEarningsHistory.pending, (state) => {
        state.earningsHistoryLoading = true
      })
      .addCase(midgardActions.getEarningsHistory.fulfilled, (state, action) => {
        state.earningsHistoryLoading = false
        state.earningsHistory = action.payload
      })
      .addCase(midgardActions.getEarningsHistory.rejected, (state) => {
        state.earningsHistoryLoading = true
      })
      // get swap history
      .addCase(midgardActions.getSwapHistory.pending, (state) => {
        state.swapHistoryLoading = true
      })
      .addCase(midgardActions.getSwapHistory.fulfilled, (state, action) => {
        state.swapHistoryLoading = false
        state.swapHistory = action.payload
      })
      .addCase(midgardActions.getSwapHistory.rejected, (state) => {
        state.swapHistoryLoading = true
      })
      // get liquidity history
      .addCase(midgardActions.getLiquidityHistory.pending, (state) => {
        state.liquidityHistoryLoading = true
      })
      .addCase(
        midgardActions.getLiquidityHistory.fulfilled,
        (state, action) => {
          state.liquidityHistoryLoading = false
          state.liquidityHistory = action.payload
        },
      )
      .addCase(midgardActions.getLiquidityHistory.rejected, (state) => {
        state.liquidityHistoryLoading = true
      })
      // get tx
      .addCase(midgardActions.getActions.pending, (state) => {
        state.txDataLoading = true
      })
      .addCase(midgardActions.getActions.fulfilled, (state, action) => {
        state.txDataLoading = false
        state.txData = action.payload
      })
      .addCase(midgardActions.getActions.rejected, (state) => {
        state.txDataLoading = true
      })
      // poll Tx
      .addCase(midgardActions.pollTx.fulfilled, (state, action) => {
        const { arg: txTracker } = action.meta
        const { actions } = action.payload
        const txData = actions?.[0]

        if (txData) {
          state.txTrackers = state.txTrackers.map((tracker: TxTracker) => {
            if (tracker.uuid === txTracker.uuid) {
              const status =
                txData.status === ActionStatusEnum.Pending
                  ? TxTrackerStatus.Pending
                  : TxTrackerStatus.Success

              const refunded =
                status === TxTrackerStatus.Success &&
                txData.type === ActionTypeEnum.Refund

              return {
                ...tracker,
                action: txData,
                status,
                refunded,
              }
            }

            return tracker
          })
        }
      })
  },
})

export const { reducer, actions } = slice

export default slice
