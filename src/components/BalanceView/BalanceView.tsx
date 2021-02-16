import React from 'react'

import {
  Wallet,
  SupportedChain,
  ChainWallet,
  AssetAmount,
  Asset,
  getTotalUSDPriceInBalance,
  formatBigNumber,
} from 'multichain-sdk'

import { AssetData } from 'components/Assets'
import { ChainHeader } from 'components/ChainHeader'

import { useMidgard } from 'redux/midgard/hooks'

import * as Styled from './BalanceView.style'

export type BalanceViewProps = {
  wallet: Wallet
  onReloadChain?: (chain: SupportedChain) => void
  onSendAsset?: (asset: Asset) => void
}

export const BalanceView = (props: BalanceViewProps) => {
  const { wallet, onReloadChain = () => {}, onSendAsset = () => {} } = props
  const { pools } = useMidgard()

  const renderBalance = (balance: AssetAmount[]) => {
    return balance.map((data: AssetAmount, index) => (
      <Styled.BalanceRow key={index}>
        <AssetData asset={data.asset} amount={data.amount} decimal={3} />
        <Styled.SendBtn
          onClick={() => onSendAsset(data.asset)}
          fixedWidth={false}
        >
          Send
        </Styled.SendBtn>
      </Styled.BalanceRow>
    ))
  }

  const renderChainBalance = (
    chain: SupportedChain,
    chainBalance: ChainWallet,
  ) => {
    const { address, balance } = chainBalance
    const usdPrice = getTotalUSDPriceInBalance(balance, pools)
    const totalPrice = formatBigNumber(usdPrice, 2)

    return (
      <Styled.ChainContainer>
        <ChainHeader
          chain={chain}
          address={address}
          totalPrice={totalPrice}
          onReload={() => onReloadChain(chain)}
        />
        {renderBalance(balance)}
      </Styled.ChainContainer>
    )
  }

  return (
    <Styled.Container>
      {Object.keys(wallet).map((chain) => {
        const chainBalance = wallet[chain as SupportedChain]

        return renderChainBalance(chain as SupportedChain, chainBalance)
      })}
    </Styled.Container>
  )
}
