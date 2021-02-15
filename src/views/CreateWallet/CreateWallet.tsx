import React, { useState, useCallback } from 'react'

import { ContentView, Helmet, Tabs, TabPane } from 'components'

import * as Styled from './CreateWallet.style'
import Keystore from './Keystore'
import Phrase from './Phrase'

enum TabType {
  KEYSTORE = 'KEYSTORE',
  PHRASE = 'PHRASE',
}

const CreateWallet = () => {
  const [activeTab, setActiveTab] = useState<TabType>(TabType.KEYSTORE)

  const handleChangeTab = useCallback((tab) => {
    setActiveTab(tab)
  }, [])

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
        {activeTab === TabType.KEYSTORE && <Keystore />}
        {activeTab === TabType.PHRASE && <Phrase />}
      </Styled.TabContent>
    </ContentView>
  )
}

export default CreateWallet
