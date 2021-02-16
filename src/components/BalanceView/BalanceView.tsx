import React from 'react'

import {
  Wallet,
  SupportedChain,
  ChainWallet,
  AssetAmount,
} from 'multichain-sdk'

import { AssetData } from 'components/Assets'
import { ChainHeader } from 'components/ChainHeader'

import * as Styled from './BalanceView.style'

export type BalanceViewProps = {
  wallet: Wallet
  onReloadChain?: (chain: SupportedChain) => void
}

export const BalanceView = (props: BalanceViewProps) => {
  const { wallet, onReloadChain = () => {} } = props

  const renderBalance = (balance: AssetAmount[]) => {
    return balance.map((data: AssetAmount, index) => (
      <Styled.BalanceRow key={index}>
        <AssetData asset={data.asset} amount={data.amount} />
        <Styled.SendBtn fixedWidth={false}>Send</Styled.SendBtn>
      </Styled.BalanceRow>
    ))
  }

  const renderChainBalance = (
    chain: SupportedChain,
    chainBalance: ChainWallet,
  ) => {
    const { address, balance } = chainBalance

    return (
      <Styled.ChainContainer>
        <ChainHeader
          chain={chain}
          address={address}
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
