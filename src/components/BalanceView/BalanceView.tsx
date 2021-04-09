import React, { useCallback } from 'react'

import { useHistory } from 'react-router'

import {
  Wallet,
  SupportedChain,
  ChainWallet,
  AssetAmount,
  Asset,
  getTotalUSDPriceInBalance,
  formatBigNumber,
  isOldRune,
} from 'multichain-sdk'

import { AssetData } from 'components/Assets'
import { ChainHeader } from 'components/ChainHeader'

import { useMidgard } from 'redux/midgard/hooks'

import { getSwapRoute, UPGRADE_RUNE_ROUTE } from 'settings/constants'

import * as Styled from './BalanceView.style'

export type BalanceViewProps = {
  wallet: Wallet
  chainWalletLoading: { [key in SupportedChain]: boolean }
  onReloadChain?: (chain: SupportedChain) => void
  onSendAsset?: (asset: Asset) => void
}

export const BalanceView = (props: BalanceViewProps) => {
  const {
    wallet,
    onReloadChain = () => {},
    onSendAsset = () => {},
    chainWalletLoading,
  } = props
  const { pools } = useMidgard()

  const history = useHistory()

  const handleSendAsset = useCallback(
    (asset: Asset) => {
      onSendAsset(asset)
    },
    [onSendAsset],
  )

  const handleUpgradeRune = useCallback(() => {
    history.push(UPGRADE_RUNE_ROUTE)
  }, [history])

  const handleGotoSwap = useCallback(
    (asset: Asset) => {
      if (asset.isRUNE()) {
        history.push(getSwapRoute(asset, Asset.BTC()))
      } else {
        history.push(getSwapRoute(asset, Asset.RUNE()))
      }
    },
    [history],
  )

  const renderBalance = useCallback(
    (balance: AssetAmount[]) => {
      return balance.map((data: AssetAmount, index) => {
        if (isOldRune(data.asset)) {
          return (
            <Styled.BalanceRow key={index} onClick={handleUpgradeRune}>
              <AssetData
                asset={data.asset}
                amount={data.amount}
                decimal={3}
                size="small"
              />
              <Styled.SendBtn
                onClick={(e) => {
                  e.stopPropagation()
                  handleUpgradeRune()
                }}
                fixedWidth={false}
              >
                Upgrade
              </Styled.SendBtn>
            </Styled.BalanceRow>
          )
        }

        return (
          <Styled.BalanceRow
            key={index}
            onClick={() => handleGotoSwap(data.asset)}
          >
            <AssetData
              asset={data.asset}
              amount={data.amount}
              decimal={3}
              size="small"
            />
            <Styled.SendBtn
              onClick={(e) => {
                e.stopPropagation()
                handleSendAsset(data.asset)
              }}
              fixedWidth={false}
            >
              Send
            </Styled.SendBtn>
          </Styled.BalanceRow>
        )
      })
    },
    [handleSendAsset, handleUpgradeRune, handleGotoSwap],
  )

  const renderChainBalance = useCallback(
    (chain: SupportedChain, chainBalance: ChainWallet) => {
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
            walletLoading={chainWalletLoading?.[chain]}
          />
          {renderBalance(balance)}
        </Styled.ChainContainer>
      )
    },
    [renderBalance, onReloadChain, pools, chainWalletLoading],
  )

  return (
    <Styled.Container>
      {Object.keys(wallet).map((chain) => {
        const chainBalance = wallet[chain as SupportedChain]

        return renderChainBalance(chain as SupportedChain, chainBalance)
      })}
    </Styled.Container>
  )
}
