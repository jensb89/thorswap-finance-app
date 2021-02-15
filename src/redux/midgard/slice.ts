import { createSlice } from '@reduxjs/toolkit'
import { PoolDetail } from 'midgard-sdk'
import { Asset, Amount, Pool, MULTICHAIN_DECIMAL } from 'multichain-sdk'

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
        const pools: Pool[] = []

        action.payload.map((poolDetail: PoolDetail) => {
          const asset = Asset.fromAssetString(poolDetail.asset)
          const runeDepth = Amount.fromBaseAmount(
            poolDetail.runeDepth,
            MULTICHAIN_DECIMAL,
          )
          const assetDepth = Amount.fromBaseAmount(
            poolDetail.assetDepth,
            MULTICHAIN_DECIMAL,
          )

          if (asset) {
            pools.push(new Pool(asset, runeDepth, assetDepth, poolDetail))
          }
        })

        state.pools = pools
        state.poolLoading = false
      })
      .addCase(midgardActions.getPools.rejected, (state) => {
        state.poolLoading = false
      })
  },
})

export const { reducer, actions } = slice

export default slice
