import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { Keystore } from '@xchainjs/xchain-crypto'

import { getKeystore, saveKeystore } from 'helpers/storage'

import * as walletActions from './actions'
import { State } from './types'

const initialState: State = {
  keystore: getKeystore(),
  wallet: null,
  walletLoading: false,
  isConnectModalOpen: false,
}

const slice = createSlice({
  name: 'wallet',
  initialState,
  reducers: {
    connectWallet(state, action: PayloadAction<Keystore>) {
      const keystore = action.payload

      state.keystore = keystore
      saveKeystore(keystore)
    },
    setIsConnectModalOpen(state, action: PayloadAction<boolean>) {
      state.isConnectModalOpen = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(walletActions.loadAllWallets.pending, (state) => {
        state.walletLoading = true
      })
      .addCase(walletActions.loadAllWallets.fulfilled, (state, action) => {
        state.wallet = action.payload
        state.walletLoading = false
      })
      .addCase(walletActions.loadAllWallets.rejected, (state) => {
        state.walletLoading = false
      })
      .addCase(walletActions.getWalletByChain.pending, (state) => {
        state.walletLoading = true
      })
      .addCase(walletActions.getWalletByChain.fulfilled, (state, action) => {
        const { chain, data } = action.payload
        if (state.wallet && chain in state.wallet) {
          state.wallet = {
            ...state.wallet,
            [chain]: data,
          }
        }
        state.walletLoading = false
      })
      .addCase(walletActions.getWalletByChain.rejected, (state) => {
        state.walletLoading = false
      })
  },
})

export const { reducer, actions } = slice

export default slice
