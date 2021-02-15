import React, { useState } from 'react'

// also exported from '@storybook/react' if you can deal with breaking changes in 6.1
import { Story, Meta } from '@storybook/react/types-6-0'
import { Amount, Asset } from 'multichain-sdk'

import { AssetInputCard, Props } from './AssetInputCard'

export default {
  title: 'Components/AssetInputCard',
  component: AssetInputCard,
} as Meta

const Template: Story<Props> = (args) => {
  const [amount, setAmount] = useState<Amount>(Amount.fromAssetAmount(0, 8))

  return <AssetInputCard {...args} amount={amount} onChange={setAmount} />
}

export const Default = Template.bind({})
Default.args = {
  title: 'input',
  info: 'slip 3%',
  label: '$100',
  asset: Asset.BNB(),
  assets: [Asset.BNB(), Asset.RUNE()],
  withSearch: false,
  searchDisable: [],
  onSelect: (key) => console.log(key),
}
