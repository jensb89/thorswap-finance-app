import React from 'react'

// also exported from '@storybook/react' if you can deal with breaking changes in 6.1
import { Story, Meta } from '@storybook/react/types-6-0'

import { LabelLoader } from './LabelLoader'

export default {
  title: 'Components/LabelLoader',
  component: LabelLoader,
} as Meta

const Template: Story = (args) => <LabelLoader {...args} />

export const Default = Template.bind({})
Default.args = {}
