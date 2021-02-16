import React, { useState, useCallback } from 'react'

import { useHistory } from 'react-router'

import { Keystore as KeystoreType } from '@xchainjs/xchain-crypto'
import { ContentView, Helmet, Tabs, TabPane } from 'components'

import { useWallet } from 'redux/wallet/hooks'

import { HOME_ROUTE } from 'settings/constants'

import * as Styled from './CreateWallet.style'
import KeystoreView from './Keystore'
import PhraseView from './Phrase'

enum TabType {
  KEYSTORE = 'KEYSTORE',
  PHRASE = 'PHRASE',
}

const CreateWallet = () => {
  const history = useHistory()

  const { unlockWallet } = useWallet()

  const [activeTab, setActiveTab] = useState<TabType>(TabType.KEYSTORE)

  const handleChangeTab = useCallback((tab) => {
    setActiveTab(tab)
  }, [])

  const handleConnect = useCallback(
    (keystore: KeystoreType, phrase: string) => {
      unlockWallet(keystore, phrase)

      history.push(HOME_ROUTE)
    },
    [unlockWallet, history],
  )

  return (
    <ContentView>
      <Helmet title="Create Wallet" content="Create Wallet" />
      <Styled.TabHeader>
        <Tabs activeKey={activeTab} onChange={handleChangeTab} action>
          <TabPane key={TabType.KEYSTORE} tab="Keystore" />
          <TabPane key={TabType.PHRASE} tab="Phrase" />
        </Tabs>
      </Styled.TabHeader>
      <Styled.TabContent>
        {activeTab === TabType.KEYSTORE && (
          <KeystoreView onConnect={handleConnect} />
        )}
        {activeTab === TabType.PHRASE && (
          <PhraseView onConnect={handleConnect} />
        )}
      </Styled.TabContent>
    </ContentView>
  )
}

export default CreateWallet
