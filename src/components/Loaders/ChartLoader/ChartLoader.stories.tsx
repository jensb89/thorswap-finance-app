import React from 'react'

// also exported from '@storybook/react' if you can deal with breaking changes in 6.1
import { Story, Meta } from '@storybook/react/types-6-0'

import { ChartLoader } from './ChartLoader'

export default {
  title: 'Components/ChartLoader',
  component: ChartLoader,
} as Meta

const Template: Story = (args) => <ChartLoader {...args} />

export const Default = Template.bind({})
Default.args = {}
