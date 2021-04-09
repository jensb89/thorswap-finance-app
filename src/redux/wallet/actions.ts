import { createAsyncThunk } from '@reduxjs/toolkit'

import { SupportedChain } from 'multichain-sdk/clients/types'

import { multichain } from 'services/multichain'

export const loadAllWallets = createAsyncThunk(
  'midgard/loadAllWallets',
  multichain.loadAllWallets,
)

export const getWalletByChain = createAsyncThunk(
  'midgard/getWalletByChain',
  async (chain: SupportedChain) => {
    const data = await multichain.getWalletByChain(chain)

    return {
      chain,
      data,
    }
  },
)
