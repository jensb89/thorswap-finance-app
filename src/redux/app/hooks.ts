import { useCallback } from 'react'

import { useSelector, useDispatch } from 'react-redux'

import { ThemeType } from '@thorchain/asgardex-theme'
import { actions } from 'redux/app/slice'
import { RootState } from 'redux/store'

export const useApp = () => {
  const dispatch = useDispatch()

  const appState = useSelector((state: RootState) => state.app)

  const setTheme = useCallback(
    (theme: ThemeType) => {
      dispatch(actions.setThemeType(theme))
    },
    [dispatch],
  )

  return {
    ...appState,
    setTheme,
  }
}
