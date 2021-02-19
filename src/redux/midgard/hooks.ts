import { useCallback, useMemo } from 'react'

import { useDispatch, useSelector } from 'react-redux'

import { ActionListParams, HistoryInterval } from 'midgard-sdk'

import * as actions from 'redux/midgard/actions'
import { RootState } from 'redux/store'

import { TX_PUBLIC_PAGE_LIMIT } from 'settings/constants/global'

const MAX_HISTORY_COUNT = 100
const PER_DAY = 'day' as HistoryInterval

export const useMidgard = () => {
  const dispatch = useDispatch()
  const midgardState = useSelector((state: RootState) => state.midgard)

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

  return {
    ...midgardState,
    actions,
    isGlobalHistoryLoading,
    getPoolHistory,
    getGlobalHistory,
    getTxData,
  }
}
