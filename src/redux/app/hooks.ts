import { useCallback } from 'react'

import { useSelector, useDispatch } from 'react-redux'

import { ThemeType } from '@thorchain/asgardex-theme'
import { Asset } from 'multichain-sdk'

import { actions } from 'redux/app/slice'
import { RootState } from 'redux/store'

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

  return {
    ...appState,
    setTheme,
    baseCurrencyAsset,
    setBaseCurrency,
  }
}
