import React from 'react'

// also exported from '@storybook/react' if you can deal with breaking changes in 6.1
import { Story, Meta } from '@storybook/react/types-6-0'
import { Asset } from 'multichain-sdk'

import { AssetSelect, Props } from './AssetSelect'

export default {
  title: 'Components/AssetSelect',
  component: AssetSelect,
} as Meta

const Template: Story<Props> = (args) => <AssetSelect {...args} />

export const Default = Template.bind({})
Default.args = {
  asset: Asset.BNB(),
  assets: [Asset.BNB(), Asset.RUNE()],
  withSearch: false,
  searchDisable: [],
  onSelect: (key) => console.log(key),
}
