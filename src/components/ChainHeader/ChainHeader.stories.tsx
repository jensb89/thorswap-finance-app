import React from 'react'

// also exported from '@storybook/react' if you can deal with breaking changes in 6.1
import { Story, Meta } from '@storybook/react/types-6-0'

import { ChainHeader, ChainHeaderProps } from './ChainHeader'

export default {
  title: 'Components/ChainHeader',
  component: ChainHeader,
} as Meta

const Template: Story<ChainHeaderProps> = (args) => <ChainHeader {...args} />

export const Default = Template.bind({})
Default.args = {
  chain: 'BNB',
  address: 'bnb12312123123131231231123xyz',
}
