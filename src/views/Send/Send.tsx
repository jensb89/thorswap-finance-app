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
  Button,
  AssetSelect,
  Label,
} from 'components'
import {
  getWalletAssets,
  Amount,
  Asset,
  getAssetBalance,
  AssetAmount,
  Memo,
  getWalletAddressByChain,
  Wallet,
} from 'multichain-sdk'

import { useMidgard } from 'redux/midgard/hooks'
import { useWallet } from 'redux/wallet/hooks'

import { multichain } from 'services/multichain'

import { getSendRoute } from 'settings/constants'

import * as Styled from './Send.style'

enum SendMode {
  NORMAL,
  EXPERT,
}

const SendView = () => {
  const { asset } = useParams<{ asset: string }>()
  const { wallet, keystore } = useWallet()

  const sendAsset = Asset.fromAssetString(asset)

  if (!sendAsset) {
    return null
  }

  if (!wallet || !keystore) {
    Notification({
      type: 'error',
      message: 'Wallet Not Found',
      description: 'Please connect wallet',
    })
    return null
  }

  return <Send sendAsset={sendAsset} wallet={wallet} />
}

const Send = ({ sendAsset, wallet }: { sendAsset: Asset; wallet: Wallet }) => {
  const history = useHistory()
  const { pools } = useMidgard()

  const asset = useMemo(() => sendAsset.toString(), [sendAsset])

  const poolAssets = useMemo(() => {
    const assets = pools.map((pool) => pool.asset)
    assets.push(Asset.RUNE())

    return assets
  }, [pools])

  const [sendMode, setSendMode] = useState(SendMode.NORMAL)
  const isExpertMode = useMemo(() => sendMode === SendMode.EXPERT, [sendMode])

  const [sendAmount, setSendAmount] = useState<Amount>(
    Amount.fromAssetAmount(0, 8),
  )
  const [percent, setPercent] = useState(0)
  const [recipientAddress, setRecipientAddress] = useState('')
  const [poolAddress, setPoolAddress] = useState('')

  const recipient = useMemo(
    () => (isExpertMode ? poolAddress : recipientAddress),
    [isExpertMode, poolAddress, recipientAddress],
  )

  const [memo, setMemo] = useState('')
  const [visibleConfirmModal, setVisibleConfirmModal] = useState(false)

  const [outputAsset, setOutputAsset] = useState<Asset>(sendAsset)

  const walletAssets = useMemo(() => getWalletAssets(wallet), [wallet])
  const assetBalance: Amount = useMemo(() => {
    if (wallet) {
      return getAssetBalance(sendAsset, wallet).amount
    }
    return Amount.fromAssetAmount(0, 8)
  }, [sendAsset, wallet])

  useEffect(() => {
    const fetchPoolAddress = async () => {
      const poolAddr = await multichain.getPoolAddressByChain(sendAsset.chain)
      setPoolAddress(poolAddr)
    }

    if (isExpertMode) {
      fetchPoolAddress()
    }
  }, [isExpertMode, sendAsset])

  const handleSelectAsset = useCallback(
    (selected: Asset) => {
      history.push(getSendRoute(selected))
    },
    [history],
  )

  const handleSelectOutputAsset = useCallback((poolAsset: Asset) => {
    setOutputAsset(poolAsset)
    setMemo('')
  }, [])

  const handleChangeSendAmount = useCallback(
    (amount: Amount) => {
      if (amount.gt(assetBalance)) {
        setSendAmount(assetBalance)
        setPercent(100)
      } else {
        setSendAmount(amount)
        setPercent(amount.div(assetBalance).mul(100).assetAmount.toNumber())
      }
    },
    [assetBalance],
  )

  const handleChangePercent = useCallback(
    (p: number) => {
      setPercent(p)
      const newAmount = assetBalance.mul(p).div(100)
      setSendAmount(newAmount)
    },
    [assetBalance],
  )

  const handleChangeRecipient = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const addr = e.target.value

      if (addr === 'pool') {
        setSendMode(SendMode.EXPERT)
      } else {
        setSendMode(SendMode.NORMAL)
        setPoolAddress('')
      }
      setRecipientAddress(addr)
    },
    [],
  )

  const handleChangePoolAddress = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const addr = e.target.value
      setPoolAddress(addr)
    },
    [],
  )

  const handleChangeMemo = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setMemo(e.target.value)
    },
    [],
  )

  const handleConfirmSend = useCallback(async () => {
    setVisibleConfirmModal(false)

    if (sendAsset) {
      const assetAmount = new AssetAmount(sendAsset, sendAmount)
      console.log('recipient', recipient)
      console.log('memo', memo)
      const txHash = await multichain.transfer({
        assetAmount,
        recipient,
        memo,
      })

      console.log('txhash', txHash)
    }
  }, [sendAsset, sendAmount, recipient, memo])

  const handleCancelSend = useCallback(() => {
    setVisibleConfirmModal(false)
  }, [])

  const handleDragSend = useCallback(() => {
    setVisibleConfirmModal(true)
  }, [])

  const handleSelectDepositMemo = useCallback(() => {
    setMemo(Memo.depositMemo(sendAsset))
  }, [sendAsset])

  const handleSelectSwapMemo = useCallback(() => {
    if (outputAsset) {
      const address = getWalletAddressByChain(wallet, outputAsset.chain) || ''
      setMemo(Memo.swapMemo(outputAsset, address))
    }
  }, [outputAsset, wallet])

  const renderConfirmModalContent = useMemo(() => {
    return (
      <Styled.ConfirmModalContent>
        <Information
          title="Send"
          description={sendAsset.ticker.toUpperCase()}
        />
        <Information title="Recipient" description={recipientAddress} />
        <Information title="Memo" description={memo} />
      </Styled.ConfirmModalContent>
    )
  }, [sendAsset, memo, recipientAddress])

  if (!sendAsset || !outputAsset) return null

  return (
    <Styled.Container>
      <Styled.ContentPanel>
        <Helmet title={`Send ${asset}`} content={`Send ${asset}`} />
        <ContentTitle>Send {asset}</ContentTitle>

        <Styled.CardContainer>
          <AssetInputCard
            title="input"
            asset={sendAsset}
            assets={walletAssets}
            amount={sendAmount}
            onChange={handleChangeSendAmount}
            onSelect={handleSelectAsset}
          />
          <Slider value={percent} onChange={handleChangePercent} withLabel />
        </Styled.CardContainer>

        {isExpertMode && (
          <Styled.PoolSelect>
            <Label size="big" align="center">
              Select Output Asset
            </Label>
            <AssetSelect
              asset={outputAsset}
              assets={poolAssets}
              onSelect={handleSelectOutputAsset}
            />
          </Styled.PoolSelect>
        )}
        <Styled.FormItem>
          <Styled.FormLabel>Recipient</Styled.FormLabel>
          <Input
            typevalue="ghost"
            sizevalue="big"
            value={recipientAddress}
            onChange={handleChangeRecipient}
            placeholder="Recipient"
          />
        </Styled.FormItem>

        {isExpertMode && (
          <Styled.FormItem>
            <Styled.FormLabel>Pool Address</Styled.FormLabel>
            <Input
              typevalue="ghost"
              sizevalue="big"
              value={poolAddress}
              onChange={handleChangePoolAddress}
              placeholder="Pool Address"
            />
          </Styled.FormItem>
        )}

        {isExpertMode && (
          <Styled.FormItem>
            <Styled.FormLabel>Select Memo Type</Styled.FormLabel>
            <Styled.MemoTypes>
              <Button
                sizevalue="small"
                color="primary"
                typevalue="outline"
                onClick={handleSelectDepositMemo}
              >
                Deposit
              </Button>
              <Button
                sizevalue="small"
                color="primary"
                typevalue="outline"
                onClick={handleSelectSwapMemo}
              >
                Swap
              </Button>
            </Styled.MemoTypes>
          </Styled.FormItem>
        )}
        <Styled.FormItem>
          <Styled.FormLabel>Memo</Styled.FormLabel>
          <Input
            typevalue="ghost"
            sizevalue="big"
            value={memo}
            onChange={handleChangeMemo}
            placeholder="Memo"
          />
        </Styled.FormItem>

        <Styled.DragContainer>
          <Drag
            title="Drag to send"
            source={sendAsset}
            onConfirm={handleDragSend}
          />
        </Styled.DragContainer>
      </Styled.ContentPanel>
      <ConfirmModal
        visible={visibleConfirmModal}
        onOk={handleConfirmSend}
        onCancel={handleCancelSend}
      >
        {renderConfirmModalContent}
      </ConfirmModal>
    </Styled.Container>
  )
}

export default SendView
