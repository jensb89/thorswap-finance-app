import { createAsyncThunk } from '@reduxjs/toolkit'

import { midgardApi } from 'services/midgard'

export const getPools = createAsyncThunk(
  'midgard/getPools',
  midgardApi.getPools,
)
