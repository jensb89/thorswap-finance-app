import React, { useState } from 'react'

// also exported from '@storybook/react' if you can deal with breaking changes in 6.1
import { Story, Meta } from '@storybook/react/types-6-0'
import { Amount, Asset } from 'multichain-sdk'

import AssetCard, { Props } from './AssetCard'

export default {
  title: 'Components/AssetCard',
  component: AssetCard,
} as Meta

const Template: Story<Props> = (args) => {
  const [amount, setAmount] = useState<Amount>(Amount.fromAssetAmount(0, 8))
  const [percent, setPercent] = useState(0)

  return (
    <AssetCard
      {...args}
      sliderPercent={percent}
      onChangePercent={setPercent}
      amount={amount}
      onChangeAmount={setAmount}
    />
  )
}

export const Default = Template.bind({})
Default.args = {
  asset: Asset.BNB(),
  assets: [Asset.BNB(), Asset.RUNE()],
  withSearch: true,
  searchDisable: [],
  title: 'input',
}
