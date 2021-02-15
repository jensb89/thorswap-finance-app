import React from 'react'

// also exported from '@storybook/react' if you can deal with breaking changes in 6.1
import { Story, Meta } from '@storybook/react/types-6-0'

import { StepBar, Props } from './StepBar'

export default {
  title: 'Components/StepBar',
  component: StepBar,
} as Meta

const Template: Story<Props> = (args) => <StepBar {...args} />

export const Default = Template.bind({})
Default.args = {
  size: 100,
}
