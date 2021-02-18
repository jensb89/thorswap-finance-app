import { useEffect, useCallback } from 'react'

import { useDispatch } from 'react-redux'

import { useMidgard } from 'redux/midgard/hooks'

/**
 * hooks for managing global state per page, loading moments
 */
export const useGlobalState = () => {
  const dispatch = useDispatch()
  const { actions } = useMidgard()

  const loadInitialData = useCallback(() => {
    dispatch(actions.getPools())
    dispatch(actions.getStats())
    dispatch(actions.getNetworkData())
    dispatch(actions.getQueue())
  }, [dispatch, actions])

  // initial state when the first load
  useEffect(() => {
    loadInitialData()
  }, [loadInitialData])

  const refreshPage = useCallback(() => {
    loadInitialData()
  }, [loadInitialData])

  return {
    refreshPage,
  }
}
