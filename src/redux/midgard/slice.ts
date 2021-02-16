import { createSlice } from '@reduxjs/toolkit'
import { Pool } from 'multichain-sdk'

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
        const pools = action.payload

        state.pools = pools.reduce((res: Pool[], poolDetail) => {
          const poolObj = Pool.fromPoolData(poolDetail)
          if (poolObj) {
            res.push(poolObj)
          }
          return res
        }, [])

        state.poolLoading = false
      })
      .addCase(midgardActions.getPools.rejected, (state) => {
        state.poolLoading = false
      })
  },
})

export const { reducer, actions } = slice

export default slice
