import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { ThemeType } from '@thorchain/asgardex-theme'

import { getTheme, saveTheme } from 'helpers/storage'

import { State } from './types'

const defaultTheme = getTheme()

const initialState: State = {
  themeType: defaultTheme,
}

const slice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setThemeType(state: State, action: PayloadAction<ThemeType>) {
      const themeType = action.payload

      state.themeType = themeType
      saveTheme(themeType)
    },
  },
})

export const { reducer, actions } = slice

export default slice
