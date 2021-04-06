import { useCallback } from 'react'

import { uuid as uuidv4 } from 'uuidv4'

import { useMidgard } from 'redux/midgard/hooks'
import { TxTracker } from 'redux/midgard/types'

/**
 * 1. send transaction and get txHash
 * 2. poll midgard action API and get "in" tx with the same txHash
 * 3. check action status (success, pending)
 * 4. check action type and match with send tx type
 *    (if action type is not "refund", action type should be matched to the send type)
 */

export const UseTxTracker = () => {
  const { addNewTxTracker, clearTxTrackers } = useMidgard()

  const addNewTx = useCallback(
    ({ type, status }: TxTracker): string => {
      const uuid = uuidv4()

      addNewTxTracker({
        uuid,
        type,
        status,
        submitTx: null,
        action: null,
        refunded: null,
      })

      return uuid
    },
    [addNewTxTracker],
  )

  return {
    addNewTx,
    clearTxTrackers,
  }
}
