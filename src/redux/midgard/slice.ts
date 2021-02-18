import { createSlice } from '@reduxjs/toolkit'
import { Pool } from 'multichain-sdk'

import * as midgardActions from './actions'
import { State } from './types'

const initialState: State = {
  pools: [],
  poolLoading: false,
  stats: null,
  networkData: null,
  constants: null,
  queue: null,
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
      .addCase(midgardActions.getStats.fulfilled, (state, action) => {
        state.stats = action.payload
      })
      .addCase(midgardActions.getNetworkData.fulfilled, (state, action) => {
        state.networkData = action.payload
      })
      .addCase(midgardActions.getConstants.fulfilled, (state, action) => {
        state.constants = action.payload
      })
      .addCase(midgardActions.getQueue.fulfilled, (state, action) => {
        state.queue = action.payload
      })
  },
})

export const { reducer, actions } = slice

export default slice
