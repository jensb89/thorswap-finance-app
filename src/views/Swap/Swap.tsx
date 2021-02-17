import React, { useEffect, useMemo, useState, useCallback } from 'react'

import { useHistory, useParams } from 'react-router'

import {
  ContentTitle,
  Helmet,
  AssetInputCard,
  Slider,
  Input,
  Drag,
  ConfirmModal,
  Information,
  Notification,
} from 'components'
import {
  getWalletAssets,
  Amount,
  Asset,
  getAssetBalance,
  AssetAmount,
  Memo,
  getWalletAddressByChain,
} from 'multichain-sdk'

import { useMidgard } from 'redux/midgard/hooks'
import { useWallet } from 'redux/wallet/hooks'

import { multichain } from 'services/multichain'

import { getSwapRoute } from 'settings/constants'

import * as Styled from './Swap.style'
import { Pair } from './types'
import { getSwapPair } from './utils'

const SwapView = () => {
  const { pair } = useParams<{ pair: string }>()

  const swapPair = getSwapPair(pair)

  if (swapPair) {
    const { inputAsset, outputAsset } = swapPair
    return <Swap inputAsset={inputAsset} outputAsset={outputAsset} />
  }

  return null
}

const Swap = ({ inputAsset, outputAsset }: Pair) => {
  const history = useHistory()
  const { wallet } = useWallet()
  const { pools } = useMidgard()

  const poolAssets = useMemo(() => {
    const assets = pools.map((pool) => pool.asset)
    assets.push(Asset.RUNE())

    return assets
  }, [pools])
  const walletAssets = useMemo(() => getWalletAssets(wallet), [wallet])

  const [inputAmount, setInputAmount] = useState<Amount>(
    Amount.fromAssetAmount(0, 8),
  )
  const [percent, setPercent] = useState(0)
  const [recipient, setRecipient] = useState('')
  const [visibleConfirmModal, setVisibleConfirmModal] = useState(false)

  useEffect(() => {
    if (wallet) {
      const address = getWalletAddressByChain(wallet, outputAsset.chain)
      setRecipient(address || '')
    }
  }, [wallet, outputAsset])

  const assetBalance: Amount = useMemo(() => {
    if (wallet) {
      return getAssetBalance(inputAsset, wallet).amount
    }
    return Amount.fromAssetAmount(0, 8)
  }, [inputAsset, wallet])

  const handleChangeRecipient = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const addr = e.target.value
      setRecipient(addr)
    },
    [],
  )

  const handleSelectInputAsset = useCallback(
    (input: Asset) => {
      history.push(getSwapRoute(input, outputAsset))
    },
    [history, outputAsset],
  )

  const handleSelectOutputAsset = useCallback(
    (output: Asset) => {
      history.push(getSwapRoute(inputAsset, output))
    },
    [history, inputAsset],
  )

  const handleChangeInputAmount = useCallback(
    (amount: Amount) => {
      if (amount.gt(assetBalance)) {
        setInputAmount(assetBalance)
        setPercent(100)
      } else {
        setInputAmount(amount)
        setPercent(amount.div(assetBalance).mul(100).assetAmount.toNumber())
      }
    },
    [assetBalance],
  )

  const handleChangePercent = useCallback(
    (p: number) => {
      setPercent(p)
      const newAmount = assetBalance.mul(p).div(100)
      setInputAmount(newAmount)
    },
    [assetBalance],
  )

  const handleConfirm = useCallback(async () => {
    setVisibleConfirmModal(false)

    if (wallet) {
      const assetAmount = new AssetAmount(inputAsset, inputAmount)
      const memo = Memo.swapMemo(outputAsset, recipient)

      console.log('recipient', recipient)
      console.log('memo', memo)
      const txHash = await multichain.transfer({
        assetAmount,
        recipient,
        memo,
      })

      console.log('txhash', txHash)
    }
  }, [wallet, inputAsset, outputAsset, inputAmount, recipient])

  const handleCancel = useCallback(() => {
    setVisibleConfirmModal(false)
  }, [])

  const handleDrag = useCallback(() => {
    if (wallet) {
      setVisibleConfirmModal(true)
    } else {
      Notification({
        type: 'error',
        message: 'Wallet Not Found',
        description: 'Please connect wallet',
      })
    }
  }, [wallet])

  const renderConfirmModalContent = useMemo(() => {
    const memo = Memo.swapMemo(outputAsset, recipient)

    return (
      <Styled.ConfirmModalContent>
        <Information
          title="Send"
          description={inputAsset.ticker.toUpperCase()}
        />
        <Information
          title="Receive"
          description={outputAsset.ticker.toUpperCase()}
        />
        <Information title="Recipient" description={recipient} />
        <Information title="Memo" description={memo} />
      </Styled.ConfirmModalContent>
    )
  }, [inputAsset, outputAsset, recipient])

  const title = useMemo(
    () => `Swap ${inputAsset.toString()} >> ${outputAsset.toString()}`,
    [inputAsset, outputAsset],
  )

  return (
    <Styled.Container>
      <Styled.ContentPanel>
        <Helmet title={title} content={title} />
        <ContentTitle>{title}</ContentTitle>

        <Styled.CardContainer>
          <AssetInputCard
            title="send"
            asset={inputAsset}
            assets={walletAssets}
            amount={inputAmount}
            onChange={handleChangeInputAmount}
            onSelect={handleSelectInputAsset}
          />
          <Slider value={percent} onChange={handleChangePercent} withLabel />
        </Styled.CardContainer>
        <AssetInputCard
          title="receive"
          asset={outputAsset}
          assets={poolAssets}
          onSelect={handleSelectOutputAsset}
          inputProps={{ disabled: true }}
        />
        <Styled.FormItem>
          <Styled.FormLabel>Recipient</Styled.FormLabel>
          <Input
            typevalue="ghost"
            sizevalue="big"
            value={recipient}
            onChange={handleChangeRecipient}
            placeholder="Recipient"
          />
        </Styled.FormItem>

        <Styled.DragContainer>
          <Drag
            title="Drag to swap"
            source={inputAsset}
            target={outputAsset}
            onConfirm={handleDrag}
          />
        </Styled.DragContainer>
      </Styled.ContentPanel>
      <ConfirmModal
        visible={visibleConfirmModal}
        onOk={handleConfirm}
        onCancel={handleCancel}
      >
        {renderConfirmModalContent}
      </ConfirmModal>
    </Styled.Container>
  )
}

export default SwapView
