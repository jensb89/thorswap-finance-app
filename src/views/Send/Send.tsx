import React, { useMemo, useState, useCallback } from 'react'

import { useHistory, useParams } from 'react-router'

import {
  ContentTitle,
  Helmet,
  AssetInputCard,
  Slider,
  Input,
  Drag,
} from 'components'
import { getWalletAssets, Amount, Asset } from 'multichain-sdk'

import { useWallet } from 'redux/wallet/hooks'

import { getSendRoute } from 'settings/constants'

import * as Styled from './Send.style'

const SendView = () => {
  const history = useHistory()
  const { asset } = useParams<{ asset: string }>()
  const { wallet } = useWallet()

  const [sendAmount, setSendAmount] = useState<Amount>(
    Amount.fromAssetAmount(0, 8),
  )
  const [percent, setPercent] = useState(0)
  const [recipientAddress, setRecipientAddress] = useState('')
  const [memo, setMemo] = useState('')

  const walletAssets = useMemo(() => getWalletAssets(wallet), [wallet])

  const handleSelectAsset = useCallback(
    (selected: Asset) => {
      history.push(getSendRoute(selected))
    },
    [history],
  )

  const handleChangePercent = useCallback((p: number) => {
    setPercent(p)
  }, [])

  const handleChangeRecipient = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const addr = e.target.value
      setRecipientAddress(addr)
    },
    [],
  )

  const handleChangeMemo = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setMemo(e.target.value)
    },
    [],
  )

  const handleSend = useCallback(() => {}, [])

  const sendAsset = Asset.fromAssetString(asset)

  if (!sendAsset) return null

  return (
    <Styled.Container>
      <Styled.ContentPanel>
        <Helmet title="Send View" content="Send View" />
        <ContentTitle>Send {asset}</ContentTitle>

        <Styled.CardContainer>
          <AssetInputCard
            title="input"
            asset={sendAsset}
            assets={walletAssets}
            amount={sendAmount}
            onChange={setSendAmount}
            onSelect={handleSelectAsset}
          />
          <Slider value={percent} onChange={handleChangePercent} withLabel />
        </Styled.CardContainer>

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
            onConfirm={handleSend}
          />
        </Styled.DragContainer>
      </Styled.ContentPanel>
    </Styled.Container>
  )
}

export default SendView
