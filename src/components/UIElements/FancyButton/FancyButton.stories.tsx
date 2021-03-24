import React from 'react'

// also exported from '@storybook/react' if you can deal with breaking changes in 6.1
import { Story, Meta } from '@storybook/react/types-6-0'

import { FancyButton, FancyButtonProps } from './index'

export default {
  title: 'Components/FancyButton',
  component: FancyButton,
} as Meta

const Template: Story<FancyButtonProps> = (args) => <FancyButton {...args} />

export const Default = Template.bind({})
Default.args = {
  children: 'So Fancy',
  disabled: false,
}
