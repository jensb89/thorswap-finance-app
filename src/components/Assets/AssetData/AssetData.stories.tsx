import React from 'react'

// also exported from '@storybook/react' if you can deal with breaking changes in 6.1
import { Story, Meta } from '@storybook/react/types-6-0'
import { Amount, Asset } from 'multichain-sdk'

import { AssetData, Props } from './AssetData'

export default {
  title: 'Components/AssetData',
  component: AssetData,
} as Meta

const Template: Story<Props> = (args) => <AssetData {...args} />

export const Default = Template.bind({})
Default.args = {
  asset: Asset.BNB(),
  amount: Amount.fromAssetAmount(123456.78, 8),
}
