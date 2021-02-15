import React from 'react'

// also exported from '@storybook/react' if you can deal with breaking changes in 6.1
import { Story, Meta } from '@storybook/react/types-6-0'

import { StatusBadge, Props } from './StatusBadge'

export default {
  title: 'Components/StatusBadge',
  component: StatusBadge,
} as Meta

const Template: Story<Props> = (args) => <StatusBadge {...args} />

export const Default = Template.bind({})
Default.args = {
  color: 'green',
}
