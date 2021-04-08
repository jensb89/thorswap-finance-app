import { useCallback } from 'react'

import { ActionTypeEnum } from 'midgard-sdk'
import { uuid as uuidv4 } from 'uuidv4'

import { useMidgard } from 'redux/midgard/hooks'
import { TxTrackerStatus, SubmitTx } from 'redux/midgard/types'

/**
 * 1. send transaction and get txHash
 * 2. poll midgard action API and get "in" tx with the same txHash
 * 3. check action status (success, pending)
 * 4. check action type and match with send tx type
 *    (if action type is not "refund", action type should be matched to the send type)
 */

export const useTxTracker = () => {
  const { addNewTxTracker, updateTxTracker, clearTxTrackers } = useMidgard()

  // confirm and submit a transaction
  const submitTransaction = useCallback(
    ({
      type,
      submitTx,
    }: {
      type: ActionTypeEnum
      submitTx: SubmitTx
    }): string => {
      const uuid = uuidv4()

      addNewTxTracker({
        uuid,
        type,
        status: TxTrackerStatus.Submitting,
        submitTx,
        action: null,
        refunded: null,
      })

      return uuid
    },
    [addNewTxTracker],
  )

  // start polling a transaction
  const pollTransaction = useCallback(
    ({ uuid, submitTx }: { uuid: string; submitTx: SubmitTx }) => {
      updateTxTracker({
        uuid,
        txTracker: {
          status: TxTrackerStatus.Pending,
          submitTx,
        },
      })
    },
    [updateTxTracker],
  )

  return {
    submitTransaction,
    pollTransaction,
    clearTxTrackers,
  }
}
