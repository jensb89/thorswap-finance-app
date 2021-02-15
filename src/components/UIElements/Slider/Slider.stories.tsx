import React from 'react'

// also exported from '@storybook/react' if you can deal with breaking changes in 6.1
import { Story, Meta } from '@storybook/react/types-6-0'

import { Slider, Props } from './Slider'

export default {
  title: 'Components/Slider',
  component: Slider,
} as Meta

const Template: Story<Props> = (args) => <Slider {...args} />

export const Default = Template.bind({})
Default.args = {
  value: 50,
  withLabel: true,
}
