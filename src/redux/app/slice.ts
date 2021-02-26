import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { ThemeType } from '@thorchain/asgardex-theme'
import { Asset } from 'multichain-sdk'

import {
  getTheme,
  saveTheme,
  saveBaseCurrency,
  getBaseCurrency,
} from 'helpers/storage'

import { State } from './types'

const defaultTheme = getTheme()

const initialState: State = {
  themeType: defaultTheme,
  baseCurrency: getBaseCurrency(),
}

const slice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setThemeType(state, action: PayloadAction<ThemeType>) {
      const themeType = action.payload

      state.themeType = themeType
      saveTheme(themeType)
    },
    setBaseCurrency(state, action: PayloadAction<Asset>) {
      const assetString = action.payload.toString()
      saveBaseCurrency(assetString)
      state.baseCurrency = assetString
    },
  },
})

export const { reducer, actions } = slice

export default slice
