import { useCallback } from 'react'

import { useDispatch } from 'react-redux'

import { Amount, Asset, Price, runeToAsset } from 'multichain-sdk'

import { useMidgard } from 'redux/midgard/hooks'

import { useApp } from './app/hooks'

/**
 * hooks for managing global state per page, loading moments
 */
export const useGlobalState = () => {
  const dispatch = useDispatch()
  const { actions, pools } = useMidgard()
  const { baseCurrency } = useApp()

  const loadInitialData = useCallback(() => {
    dispatch(actions.getPools())
    dispatch(actions.getStats())
    dispatch(actions.getNetworkData())
    dispatch(actions.getQueue())
  }, [dispatch, actions])

  const refreshPage = useCallback(() => {
    loadInitialData()
  }, [loadInitialData])

  const runeToCurrency = useCallback(
    (runeAmount: Amount): Price => {
      const quoteAsset = Asset.fromAssetString(baseCurrency)

      return runeToAsset({
        runeAmount,
        quoteAsset,
        pools,
      })
    },
    [baseCurrency, pools],
  )

  return {
    runeToCurrency,
    refreshPage,
  }
}
