import React, { useCallback, useMemo } from 'react'

import { useHistory } from 'react-router'

import { getRuneToUpgrade } from 'multichain-sdk'

import { useWallet } from 'redux/wallet/hooks'

import { UPGRADE_RUNE_ROUTE } from 'settings/constants'

import { BackLink } from '../BackLink'
import * as Styled from './SubHeader.style'

export type SubHeaderProps = {
  hasBack: boolean
}

export const SubHeader = ({ hasBack }: SubHeaderProps) => {
  const history = useHistory()
  const { wallet } = useWallet()
  const oldRune: string | null = useMemo(() => {
    if (wallet) {
      const runesToUpgrade = getRuneToUpgrade(wallet)

      if (runesToUpgrade.length > 0) {
        const oldRuneChain = `${runesToUpgrade?.[0]?.chain ?? ''} ${
          runesToUpgrade?.[1]?.chain ?? ''
        }`
        return `${oldRuneChain} RUNE Detected, Click to Upgrade to Native Rune.`
      }
    }

    return null
  }, [wallet])

  const handleUpgrade = useCallback(() => {
    history.push(UPGRADE_RUNE_ROUTE)
  }, [history])

  return (
    <Styled.Container>
      {hasBack && <BackLink />}
      {oldRune && (
        <Styled.Notify onClick={handleUpgrade}>{oldRune}</Styled.Notify>
      )}
    </Styled.Container>
  )
}
