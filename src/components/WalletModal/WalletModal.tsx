import React, { useCallback, useState } from 'react'

import { Keystore as KeystoreType } from '@xchainjs/xchain-crypto'
import { Overlay } from 'components'

import { useWallet } from 'redux/wallet/hooks'

import ConnectKeystoreView from './ConnectKeystore'
import CreateKeystoreView from './CreateKeystore'
import * as Styled from './WalletModal.style'

const WalletModal = () => {
  const [isConnectMode, setIsConnectMode] = useState(true)

  const {
    unlockWallet,
    setIsConnectModalOpen,
    isConnectModalOpen,
  } = useWallet()

  const handleConnect = useCallback(
    async (keystore: KeystoreType, phrase: string) => {
      await unlockWallet(keystore, phrase)

      setIsConnectModalOpen(false)
    },
    [unlockWallet, setIsConnectModalOpen],
  )

  const toggleMode = useCallback(() => {
    setIsConnectMode(!isConnectMode)
  }, [isConnectMode])

  return (
    <Overlay
      isOpen={isConnectModalOpen}
      onDismiss={() => setIsConnectModalOpen(false)}
    >
      <Styled.ConnectContainer>
        {isConnectMode && (
          <ConnectKeystoreView
            onConnect={handleConnect}
            toggleMode={toggleMode}
          />
        )}
        {!isConnectMode && (
          <CreateKeystoreView
            onConnect={handleConnect}
            toggleMode={toggleMode}
          />
        )}
      </Styled.ConnectContainer>
    </Overlay>
  )
}

export default WalletModal
