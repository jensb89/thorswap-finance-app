import { createAsyncThunk } from '@reduxjs/toolkit'
import { Chain } from '@xchainjs/xchain-util'

import { multichain } from 'helpers/multichain'

export const loadAllWallets = createAsyncThunk(
  'midgard/loadAllWallets',
  multichain.loadAllWallets,
)

export const getWalletByChain = createAsyncThunk(
  'midgard/getWalletByChain',
  async (chain: Chain) => {
    const data = await multichain.getWalletByChain(chain)

    return {
      chain,
      data,
    }
  },
)
