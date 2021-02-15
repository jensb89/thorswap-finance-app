import React from 'react'

// also exported from '@storybook/react' if you can deal with breaking changes in 6.1
import { Story, Meta } from '@storybook/react/types-6-0'
import { Asset } from 'multichain-sdk'

import { AssetMenu, Props } from './AssetMenu'

export default {
  title: 'Components/AssetMenu',
  component: AssetMenu,
} as Meta

const Template: Story<Props> = (args) => <AssetMenu {...args} />

export const Default = Template.bind({})
Default.args = {
  asset: Asset.BNB(),
  assets: [Asset.BNB(), Asset.RUNE()],
  withSearch: false,
  searchDisable: [],
  onSelect: (key) => console.log(key),
}
