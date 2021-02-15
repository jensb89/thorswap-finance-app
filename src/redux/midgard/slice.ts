import { createSlice } from '@reduxjs/toolkit'

import * as midgardActions from './actions'
import { State } from './types'

const initialState: State = {
  pools: [],
  poolLoading: false,
}

const slice = createSlice({
  name: 'app',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(midgardActions.getPools.pending, (state) => {
        state.poolLoading = true
      })
      .addCase(midgardActions.getPools.fulfilled, (state, action) => {
        state.pools = action.payload
        state.poolLoading = false
      })
      .addCase(midgardActions.getPools.rejected, (state) => {
        state.poolLoading = false
      })
  },
})

export const { reducer, actions } = slice

export default slice
