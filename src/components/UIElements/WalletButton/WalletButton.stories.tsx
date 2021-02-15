import React from 'react'

// also exported from '@storybook/react' if you can deal with breaking changes in 6.1
import { Story, Meta } from '@storybook/react/types-6-0'

import { WalletButton, Props } from './WalletButton'

export default {
  title: 'Components/WalletButton',
  component: WalletButton,
} as Meta

const Template: Story<Props> = (args) => <WalletButton {...args} />

export const Default = Template.bind({})
Default.args = {
  address: 'someaddress123456',
}
