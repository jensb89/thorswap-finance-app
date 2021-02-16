import { combineReducers } from '@reduxjs/toolkit'

import { reducer as appReducer } from './app/slice'
import { reducer as midgardReducer } from './midgard/slice'
import { reducer as walletReducer } from './wallet/slice'

const rootReducer = combineReducers({
  app: appReducer,
  midgard: midgardReducer,
  wallet: walletReducer,
})

export default rootReducer
