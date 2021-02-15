import React from 'react'

// also exported from '@storybook/react' if you can deal with breaking changes in 6.1
import { Story, Meta } from '@storybook/react/types-6-0'

import { Menu } from './Menu'

export default {
  title: 'Components/Menu',
  component: Menu,
} as Meta

const Template: Story = () => (
  <Menu>
    <Menu.Item>item info1</Menu.Item>
    <Menu.Item>item info2</Menu.Item>
    <Menu.Item>item info3</Menu.Item>
  </Menu>
)

export const Default = Template.bind({})
Default.args = {}
