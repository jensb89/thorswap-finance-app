import React from 'react'

// also exported from '@storybook/react' if you can deal with breaking changes in 6.1
import { Story, Meta } from '@storybook/react/types-6-0'

import AddWallet from './AddWallet'

export default {
  title: 'Components/AddWallet',
  component: AddWallet,
} as Meta

const Template: Story = (args) => <AddWallet {...args} />

export const Default = Template.bind({})
Default.args = {}
