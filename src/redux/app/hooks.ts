import { useCallback } from 'react'

import { useSelector, useDispatch } from 'react-redux'

import { ThemeType } from '@thorchain/asgardex-theme'
import { FeeOptionKey } from '@xchainjs/xchain-client'
import { Asset } from 'multichain-sdk'

import { actions } from 'redux/app/slice'
import { RootState } from 'redux/store'

import { FeeOptions } from './types'

export const useApp = () => {
  const dispatch = useDispatch()

  const appState = useSelector((state: RootState) => state.app)

  const baseCurrencyAsset =
    Asset.fromAssetString(appState.baseCurrency) || Asset.USD()

  const setTheme = useCallback(
    (theme: ThemeType) => {
      dispatch(actions.setThemeType(theme))
    },
    [dispatch],
  )

  const setBaseCurrency = useCallback(
    (baseAsset: Asset) => {
      dispatch(actions.setBaseCurrency(baseAsset))
    },
    [dispatch],
  )

  const toggleSettings = useCallback(() => {
    dispatch(actions.toggleSettings())
  }, [dispatch])

  const setSlippage = useCallback(
    (slip: number) => {
      dispatch(actions.setSlippage(slip))
    },
    [dispatch],
  )

  const setFeeOptionType = useCallback(
    (feeOption: FeeOptionKey) => {
      dispatch(actions.setFeeOptionType(feeOption))
    },
    [dispatch],
  )

  return {
    ...appState,
    FeeOptions,
    baseCurrencyAsset,
    setTheme,
    setBaseCurrency,
    toggleSettings,
    setSlippage,
    setFeeOptionType,
  }
}
