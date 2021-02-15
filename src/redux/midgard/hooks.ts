import { useSelector } from 'react-redux'

import * as actions from 'redux/midgard/actions'
import { RootState } from 'redux/store'

export const useMidgard = () => {
  const midgardState = useSelector((state: RootState) => state.midgard)

  return {
    ...midgardState,
    actions,
  }
}
