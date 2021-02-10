import React, { useState } from 'react'

// also exported from '@storybook/react' if you can deal with breaking changes in 6.1
import { Story, Meta } from '@storybook/react/types-6-0'
import { Amount } from 'multichain-sdk'

import AssetInput, { Props } from './AssetInput'

export default {
  title: 'Components/AssetInput',
  component: AssetInput,
} as Meta

const Template: Story<Props> = (args) => {
  const [amount, setAmount] = useState<Amount>(Amount.fromAssetAmount(0, 8))

  return <AssetInput {...args} amount={amount} onChange={setAmount} />
}

export const Default = Template.bind({})
Default.args = {
  title: 'input',
  info: 'slip 3%',
  label: '$100',
}
