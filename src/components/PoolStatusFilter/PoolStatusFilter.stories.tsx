import React from 'react'

// also exported from '@storybook/react' if you can deal with breaking changes in 6.1
import { Story, Meta } from '@storybook/react/types-6-0'

import { PoolStatusFilter, Props } from './PoolStatusFilter'

export default {
  title: 'Components/PoolStatusFilter',
  component: PoolStatusFilter,
} as Meta

const Template: Story<Props> = (args) => <PoolStatusFilter {...args} />

export const Default = Template.bind({})
Default.args = {
  selected: 'available',
}
