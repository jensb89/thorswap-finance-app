import { useMemo } from 'react'

import { useMidgard } from 'redux/midgard/hooks'
import { TxTracker, TxStatus } from 'redux/midgard/types'

import useInterval from 'hooks/useInterval'

/**
 * 1. send transaction and get txHash
 * 2. poll midgard action API and get "in" tx with the same txHash
 * 3. check action status (success, pending)
 * 4. check action type and match with send tx type
 *    (if action type is not "refund", action type should be matched to the send type)
 */

const POLL_TX_INTERVAL = 5000 // poll tx from midgard every 5s

export const UseTxTracker = () => {
  const { pollTx, txTrackers } = useMidgard()

  const pendingTransactions = useMemo(() => {
    return txTrackers.filter(
      (tracker: TxTracker) =>
        tracker.status !== TxStatus.Submitting &&
        tracker.status !== TxStatus.Success,
    )
  }, [txTrackers])

  useInterval(
    () => {
      pendingTransactions.forEach((tracker: TxTracker) => pollTx(tracker))
    },
    pendingTransactions.length ? POLL_TX_INTERVAL : null,
  )

  return {
    txTrackers,
  }
}
