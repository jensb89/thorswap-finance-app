import React from 'react'

// also exported from '@storybook/react' if you can deal with breaking changes in 6.1
import { Story, Meta } from '@storybook/react/types-6-0'
import { Amount, Asset, AssetAmount } from 'multichain-sdk'

import { BalanceView, BalanceViewProps } from './BalanceView'

export default {
  title: 'Components/BalanceView',
  component: BalanceView,
} as Meta

const Template: Story<BalanceViewProps> = (args) => <BalanceView {...args} />

export const Default = Template.bind({})
Default.args = {
  wallet: {
    BNB: {
      address: 'bnbaddress123',
      balance: [new AssetAmount(Asset.BNB(), Amount.fromAssetAmount(123, 8))],
    },
    BTC: {
      address: 'btcaddress123',
      balance: [new AssetAmount(Asset.BTC(), Amount.fromAssetAmount(12, 8))],
    },
    THOR: {
      address: 'thoraddress123',
      balance: [new AssetAmount(Asset.RUNE(), Amount.fromAssetAmount(1234, 8))],
    },
    ETH: {
      address: 'ethaddress123',
      balance: [],
    },
    LTC: {
      address: 'ltcaddress123',
      balance: [],
    },
    // BCH: {
    //   address: 'bchaddress123',
    //   balance: [],
    // },
  },
}
