import React from 'react'

// also exported from '@storybook/react' if you can deal with breaking changes in 6.1
import { Story, Meta } from '@storybook/react/types-6-0'

import Header from './Header'

export default {
  title: 'Components/Header',
  component: Header,
} as Meta

const Template: Story = (args) => <Header {...args} />

export const Default = Template.bind({})
Default.args = {}
