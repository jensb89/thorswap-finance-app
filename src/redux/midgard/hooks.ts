import { useCallback, useMemo } from 'react'

import { useDispatch, useSelector } from 'react-redux'

import { THORChain } from '@xchainjs/xchain-util'
import { ActionListParams, HistoryInterval } from 'midgard-sdk'

import * as actions from 'redux/midgard/actions'
import { actions as sliceActions } from 'redux/midgard/slice'
import { RootState } from 'redux/store'

import { TX_PUBLIC_PAGE_LIMIT } from 'settings/constants/global'

import { TxTracker } from './types'

const MAX_HISTORY_COUNT = 100
const PER_DAY = 'day' as HistoryInterval

export const useMidgard = () => {
  const dispatch = useDispatch()
  const midgardState = useSelector((state: RootState) => state.midgard)
  const walletState = useSelector((state: RootState) => state.wallet)
  const wallet = useMemo(() => walletState.wallet, [walletState])

  const isGlobalHistoryLoading = useMemo(
    () =>
      midgardState.earningsHistoryLoading ||
      midgardState.swapHistoryLoading ||
      midgardState.liquidityHistoryLoading,
    [midgardState],
  )

  // get earnings, swap, liquidity history
  const getGlobalHistory = useCallback(() => {
    dispatch(
      actions.getEarningsHistory({
        interval: PER_DAY,
        count: MAX_HISTORY_COUNT,
      }),
    )
    dispatch(
      actions.getSwapHistory({
        query: {
          interval: PER_DAY,
          count: MAX_HISTORY_COUNT,
        },
      }),
    )
    dispatch(
      actions.getLiquidityHistory({
        query: {
          interval: PER_DAY,
          count: MAX_HISTORY_COUNT,
        },
      }),
    )
  }, [dispatch])

  const getPoolHistory = useCallback(
    (pool: string) => {
      const query = {
        pool,
        query: {
          interval: PER_DAY,
          count: MAX_HISTORY_COUNT,
        },
      }
      dispatch(actions.getSwapHistory(query))
      dispatch(actions.getDepthHistory(query))
      dispatch(actions.getLiquidityHistory(query))
    },
    [dispatch],
  )

  // get tx data
  const getTxData = useCallback(
    (params: Omit<ActionListParams, 'limit'>) => {
      dispatch(
        actions.getActions({
          ...params,
          limit: TX_PUBLIC_PAGE_LIMIT,
        }),
      )
    },
    [dispatch],
  )

  const getMemberDetails = useCallback(() => {
    if (!wallet) return

    const thorAddress = wallet?.[THORChain]?.address

    if (thorAddress) {
      dispatch(actions.getMemberDetail(thorAddress))
    }
  }, [dispatch, wallet])

  const addNewTxTracker = useCallback(
    (txTracker: TxTracker) => {
      dispatch(sliceActions.addNewTxTracker(txTracker))
    },
    [dispatch],
  )

  const updateTxTracker = useCallback(
    ({ uuid, txTracker }: { uuid: string; txTracker: Partial<TxTracker> }) => {
      dispatch(sliceActions.updateTxTracker({ uuid, txTracker }))
    },
    [dispatch],
  )

  const pollTx = useCallback(
    (txTracker: TxTracker) => {
      dispatch(actions.pollTx(txTracker))
    },
    [dispatch],
  )

  const clearTxTrackers = useCallback(() => {
    dispatch(sliceActions.clearTxTrackers())
  }, [dispatch])

  const setTxCollapsed = useCallback(
    (collapsed: boolean) => {
      dispatch(sliceActions.setTxCollapsed(collapsed))
    },
    [dispatch],
  )

  return {
    ...midgardState,
    actions,
    isGlobalHistoryLoading,
    getPoolHistory,
    getGlobalHistory,
    getTxData,
    getMemberDetails,
    addNewTxTracker,
    updateTxTracker,
    clearTxTrackers,
    setTxCollapsed,
    pollTx,
  }
}
