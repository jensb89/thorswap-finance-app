import React from 'react'

// also exported from '@storybook/react' if you can deal with breaking changes in 6.1
import { Story, Meta } from '@storybook/react/types-6-0'
import { Asset } from 'multichain-sdk'

import { Drag, Props } from './Drag'

export default {
  title: 'Components/Drag',
  component: Drag,
} as Meta

const Template: Story<Props> = (args) => <Drag {...args} />

export const Default = Template.bind({})
Default.args = {
  title: 'title',
  source: Asset.RUNE(),
}
