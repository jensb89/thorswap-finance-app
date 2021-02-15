import { createAsyncThunk } from '@reduxjs/toolkit'

import { midgardApi } from 'helpers/midgard'

export const getPools = createAsyncThunk(
  'midgard/getPools',
  midgardApi.getPools,
)
