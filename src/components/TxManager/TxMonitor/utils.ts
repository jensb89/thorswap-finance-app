import { ActionTypeEnum, Transaction } from 'midgard-sdk'
import { Asset, Amount } from 'multichain-sdk'

import { TxTracker, TxTrackerStatus } from 'redux/midgard/types'

import { multichain } from 'services/multichain'

import { ProgressStatus } from './types'

export const getTxTitle = (txTracker: TxTracker): string => {
  const { type, submitTx } = txTracker

  if (type === ActionTypeEnum.Swap) {
    const { inAssets, outAssets } = submitTx
    const { asset: sendAsset, amount: sendAmount } = inAssets[0]
    const { asset: receiveAsset, amount: receiveAmount } = outAssets[0]

    const info = `Swap ${sendAmount} ${
      Asset.fromAssetString(sendAsset)?.ticker
    } for ${receiveAmount} ${Asset.fromAssetString(receiveAsset)?.ticker}`

    return info
  }

  if (type === ActionTypeEnum.AddLiquidity) {
    const { inAssets } = submitTx

    // sym add liquidity
    if (inAssets.length === 2) {
      const { asset: sendAsset1, amount: sendAmount1 } = inAssets[0]
      const { asset: sendAsset2, amount: sendAmount2 } = inAssets[1]

      const info = `Add ${sendAmount1} ${
        Asset.fromAssetString(sendAsset1)?.ticker
      }, ${sendAmount2} ${Asset.fromAssetString(sendAsset2)?.ticker}`

      return info
    }

    // asym add
    if (inAssets.length === 1) {
      const { asset: sendAsset1, amount: sendAmount1 } = inAssets[0]

      const info = `Add ${sendAmount1} ${
        Asset.fromAssetString(sendAsset1)?.ticker
      }`

      return info
    }
  }

  if (type === ActionTypeEnum.Withdraw) {
    const { outAssets } = submitTx

    // sym withdraw
    if (outAssets.length === 2) {
      const { asset: withdrawAsset1, amount: withdrawAmount1 } = outAssets[0]
      const { asset: withdrawAsset2, amount: withdrawAmount2 } = outAssets[1]

      const info = `Withdraw ${withdrawAmount1} ${
        Asset.fromAssetString(withdrawAsset1)?.ticker
      }, ${withdrawAmount2} ${Asset.fromAssetString(withdrawAsset2)?.ticker}`

      return info
    }

    // asym withdraw
    if (outAssets.length === 1) {
      const { asset: withdrawAsset1, amount: withdrawAmount1 } = outAssets[0]

      const info = `Withdraw ${withdrawAmount1} ${
        Asset.fromAssetString(withdrawAsset1)?.ticker
      }`

      return info
    }
  }

  return 'Transaction'
}

export const getTotalProgressStatus = (
  txTracker: TxTracker,
): ProgressStatus => {
  if (txTracker.status === TxTrackerStatus.Success) {
    if (txTracker.refunded) {
      return 'refunded'
    }

    return 'success'
  }

  return 'pending'
}

export const getTxColor = (txTracker: TxTracker) => {
  if (txTracker.status === TxTrackerStatus.Success) {
    if (txTracker.refunded) {
      return 'warning'
    }

    return 'success'
  }

  return 'primary'
}

export const getSwapInTxUrl = (txTracker: TxTracker): string => {
  const { submitTx } = txTracker

  if (submitTx?.txID) {
    const { inAssets, txID } = submitTx
    const asset = Asset.fromAssetString(inAssets[0].asset)

    if (asset) {
      return multichain.getExplorerTxUrl(asset.chain, txID)
    }
  }

  return '#'
}

export const getSwapOutTxUrl = (txTracker: TxTracker): string => {
  const { action } = txTracker

  if (action?.out) {
    const outTx = action.out[0]
    const asset = Asset.fromAssetString(outTx?.coins?.[0]?.asset)

    if (asset) {
      return multichain.getExplorerTxUrl(asset.chain, outTx?.txID)
    }
  }

  return '#'
}

/**
 * @param txTracker tx tracking data
 * @returns exact received swap data based on the midgard action
 */
export const getSwapOutTxData = async (
  txTracker: TxTracker,
): Promise<string | null> => {
  const { action } = txTracker

  if (action?.out) {
    const outTx = action.out[0]
    const asset = Asset.fromAssetString(outTx?.coins?.[0]?.asset)

    if (asset) {
      await asset?.setDecimal()

      const amount = Amount.fromBaseAmount(
        outTx?.coins?.[0]?.amount,
        asset.decimal,
      )

      if (action.type === ActionTypeEnum.Swap) {
        return `Received ${amount.toFixed(3)} ${asset.ticker}`
      }

      if (action.type === ActionTypeEnum.Refund) {
        return `Refunded ${amount.toFixed(3)} ${asset.ticker}`
      }
    }
  }

  return null
}

export const getAddTxUrl = ({
  asset,
  txTracker,
}: {
  asset: Asset
  txTracker: TxTracker
}): string => {
  const { action } = txTracker

  if (action?.in) {
    const inTx = action.in.find(
      (inData: Transaction) => inData.coins?.[0].asset === asset?.toString(),
    )

    if (inTx) {
      return multichain.getExplorerTxUrl(asset.chain, inTx?.txID)
    }
  }

  return '#'
}

export const getWithdrawTxUrl = ({
  asset,
  txTracker,
}: {
  asset: Asset
  txTracker: TxTracker
}): string => {
  const { action } = txTracker

  if (action?.out) {
    const outTx = action.out.find(
      (data: Transaction) => data.coins?.[0].asset === asset?.toString(),
    )

    if (outTx) {
      return multichain.getExplorerTxUrl(asset.chain, outTx?.txID)
    }
  }

  return '#'
}
