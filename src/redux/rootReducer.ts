import { combineReducers } from '@reduxjs/toolkit'

import { reducer as appReducer } from './app/slice'
import { reducer as midgardReducer } from './midgard/slice'

const rootReducer = combineReducers({
  app: appReducer,
  midgard: midgardReducer,
})

export default rootReducer
