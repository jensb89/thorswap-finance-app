import { useEffect } from 'react'

import { useDispatch } from 'react-redux'

import { useMidgard } from 'redux/midgard/hooks'

/**
 * hooks for managing global state per page, loading moments
 */
export const useGlobalState = () => {
  const dispatch = useDispatch()
  const { actions } = useMidgard()

  // initial state when the first load
  useEffect(() => {
    dispatch(actions.getPools())
  }, [dispatch, actions])
}
